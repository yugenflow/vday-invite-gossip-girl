import * as THREE from 'three';
import { CAMERA, PLAYER, BEDROOM, RANGE, DOOR, TARGETS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from './constants.js';
import { GameStateMachine, STATES } from './state/GameStateMachine.js';
import { gameState } from './state/GameState.js';
import { createBedroomScene } from './scenes/BedroomScene.js';
import { createRangeScene } from './scenes/RangeScene.js';
import { createCharacter, animateCharacter, swapOutfit } from './character/CharacterModel.js';
import { DogAI } from './props/Labrador.js';
import { createFPSRifle } from './props/Rifle.js';
import { ThirdPersonController } from './controls/ThirdPersonController.js';
import { FirstPersonController } from './controls/FirstPersonController.js';
import { ShootingSystem } from './systems/ShootingSystem.js';
import { TargetDodgeSystem } from './systems/TargetDodgeSystem.js';
import { CelebrationSystem } from './systems/CelebrationSystem.js';
import { InteractionSystem } from './systems/InteractionSystem.js';
import { TransitionSystem } from './systems/TransitionSystem.js';
import { HUD } from './ui/HUD.js';
import { GuidelinesOverlay } from './ui/GuidelinesOverlay.js';
import { CelebrationOverlay } from './ui/CelebrationOverlay.js';
import { ShareOverlay } from './ui/ShareOverlay.js';
import { isMobile, VirtualJoystick, TouchCameraController } from './controls/MobileControls.js';

// --- Mobile setup ---
if (isMobile) {
  document.body.classList.add('mobile-active');
  document.getElementById('start-cta-text').textContent = 'Tap anywhere to begin';
}

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.prepend(renderer.domElement);

// --- Disable right-click context menu ---
renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

// --- Camera ---
const camera = new THREE.PerspectiveCamera(CAMERA.FOV, window.innerWidth / window.innerHeight, CAMERA.NEAR, CAMERA.FAR);

// --- Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.Fog(0x111111, 40, 80);

// --- Build scenes ---
const bedroomScene = createBedroomScene();
scene.add(bedroomScene);

const rangeScene = createRangeScene();
scene.add(rangeScene);
rangeScene.visible = false; // Start hidden

// --- Character ---
const character = createCharacter();
character.position.set(PLAYER.SPAWN.x, 0, PLAYER.SPAWN.z);
scene.add(character);

// --- Wardrobe interactable (tertiary, C key) ---
const wardrobe = bedroomScene.userData.wardrobe;
if (wardrobe) {
  wardrobe.userData.tertiaryInteractable = true;
  wardrobe.userData.tertiaryType = 'wardrobe';
  wardrobe.userData.tertiaryPromptText = 'Press C to change into shooting outfit';
}

// --- Dog AI ---
const dogGroup = bedroomScene.userData.labrador;
const dogAI = dogGroup ? new DogAI(dogGroup, bedroomScene.userData.colliders || [], {
  minX: BEDROOM.ORIGIN.x - BEDROOM.WIDTH / 2,
  maxX: BEDROOM.ORIGIN.x + BEDROOM.WIDTH / 2,
  minZ: BEDROOM.ORIGIN.z - BEDROOM.DEPTH / 2,
  maxZ: BEDROOM.ORIGIN.z + BEDROOM.DEPTH / 2,
}) : null;

// --- Door interactable (invisible trigger in bedroom) ---
const doorTrigger = new THREE.Group();
const doorZ = BEDROOM.ORIGIN.z - BEDROOM.DEPTH / 2;
doorTrigger.position.set(DOOR.POSITION.x, 1, doorZ);
doorTrigger.userData.interactable = true;
doorTrigger.userData.interactionType = 'door_to_range';
doorTrigger.userData.promptText = 'Please change into shooting outfit from wardrobe to go to range!';
scene.add(doorTrigger);

// --- Door interactable in range (back to bedroom) ---
const rangeDoorTrigger = new THREE.Group();
const rangeDoorZ = RANGE.ORIGIN.z + RANGE.DEPTH / 2;
rangeDoorTrigger.position.set(RANGE.ORIGIN.x, 1, rangeDoorZ);
rangeDoorTrigger.userData.interactable = true;
rangeDoorTrigger.userData.interactionType = 'door_to_bedroom';
rangeDoorTrigger.userData.promptText = 'Press E to go back to room';
scene.add(rangeDoorTrigger);

// --- State Machine ---
const fsm = new GameStateMachine();

// --- Systems ---
const thirdPerson = new ThirdPersonController(camera, character, document, isMobile);
const firstPerson = new FirstPersonController(camera, document, isMobile);
const shootingSystem = new ShootingSystem(camera, scene);
const targetDodge = new TargetDodgeSystem(scene);
const celebration = new CelebrationSystem(scene);
const interaction = new InteractionSystem(isMobile);
const transition = new TransitionSystem(camera);

// --- Mobile controls init ---
let joystick = null;
let touchCam = null;
if (isMobile) {
  joystick = new VirtualJoystick(document.getElementById('mobile-joystick-zone'));
  touchCam = new TouchCameraController(document.getElementById('mobile-camera-zone'));

  // Shoot button
  document.getElementById('mobile-shoot-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (fsm.is(STATES.SHOOTING) && shootingSystem.enabled) {
      const result = shootingSystem.shoot();
      if (result === 'yes') {
        yesHitCount++;
        hud.showHitCounter(yesHitCount, YES_HITS_REQUIRED);
        if (yesHitCount >= YES_HITS_REQUIRED) {
          fsm.transition(STATES.CELEBRATION);
        } else {
          sendTelegram(`She hit YES! (${yesHitCount}/${YES_HITS_REQUIRED} targets) \uD83C\uDFAF`);
        }
      } else if (result && result.type === 'no') {
        targetDodge.onShootAtNo(result.target);
      }
    }
  });

  // ADS toggle
  document.getElementById('mobile-aim-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    firstPerson.toggleAim();
    e.target.classList.toggle('active', firstPerson.aiming);
  });
}

// Set targets
const targets = rangeScene.userData.targets || [];
shootingSystem.setTargets(targets);
targetDodge.setTargets(targets);

// --- UI ---
const hud = new HUD();
const guidelinesOverlay = new GuidelinesOverlay();
const celebrationOverlay = new CelebrationOverlay();
const shareOverlay = new ShareOverlay();

// --- Telegram helper ---
function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    }).catch(() => {});
  } catch (e) { /* silent */ }
}

// --- YES hit counter ---
let yesHitCount = 0;
const YES_HITS_REQUIRED = 3;

// --- Camera bounds helpers ---
const bedroomBounds = {
  minX: BEDROOM.ORIGIN.x - BEDROOM.WIDTH / 2,
  maxX: BEDROOM.ORIGIN.x + BEDROOM.WIDTH / 2,
  minY: 0,
  maxY: BEDROOM.HEIGHT,
  minZ: BEDROOM.ORIGIN.z - BEDROOM.DEPTH / 2,
  maxZ: BEDROOM.ORIGIN.z + BEDROOM.DEPTH / 2,
};
const rangeBounds = {
  minX: RANGE.ORIGIN.x - RANGE.WIDTH / 2,
  maxX: RANGE.ORIGIN.x + RANGE.WIDTH / 2,
  minY: 0,
  maxY: RANGE.HEIGHT,
  minZ: RANGE.ORIGIN.z - RANGE.DEPTH / 2,
  maxZ: RANGE.ORIGIN.z + RANGE.DEPTH / 2,
};

// --- Fade overlay ---
const fadeOverlay = document.getElementById('fade-overlay');

function fadeToBlack() {
  return new Promise(resolve => {
    fadeOverlay.classList.add('active');
    setTimeout(resolve, 600);
  });
}
function fadeFromBlack() {
  return new Promise(resolve => {
    fadeOverlay.classList.remove('active');
    setTimeout(resolve, 600);
  });
}

// --- White flash for celebration ---
function whiteFlash() {
  return new Promise(resolve => {
    fadeOverlay.style.background = '#fff';
    fadeOverlay.classList.add('active');
    setTimeout(() => {
      fadeOverlay.classList.remove('active');
      setTimeout(() => {
        fadeOverlay.style.background = '#000';
        resolve();
      }, 300);
    }, 500);
  });
}

// --- Range spawn point ---
const rangeSpawn = new THREE.Vector3(RANGE.ORIGIN.x, 0, RANGE.ORIGIN.z + RANGE.DEPTH / 2 - 2);

// --- Pointer lock on click for third-person (desktop only) ---
if (!isMobile) {
  renderer.domElement.addEventListener('click', () => {
    // In third-person states, request pointer lock on click
    if (fsm.is(STATES.BEDROOM) || fsm.is(STATES.PICKUP_RIFLE) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      if (!document.pointerLockElement) {
        renderer.domElement.requestPointerLock();
      }
    }
    // In shooting state, handle shooting
    if (fsm.is(STATES.SHOOTING) && shootingSystem.enabled) {
      if (!document.pointerLockElement) {
        renderer.domElement.requestPointerLock();
        return;
      }
      const result = shootingSystem.shoot();
      if (result === 'yes') {
        yesHitCount++;
        hud.showHitCounter(yesHitCount, YES_HITS_REQUIRED);
        if (yesHitCount >= YES_HITS_REQUIRED) {
          fsm.transition(STATES.CELEBRATION);
        } else {
          sendTelegram(`She hit YES! (${yesHitCount}/${YES_HITS_REQUIRED} targets) \uD83C\uDFAF`);
        }
      } else if (result && result.type === 'no') {
        targetDodge.onShootAtNo(result.target);
      }
    }
  });
}

// --- State transitions ---
fsm.on(STATES.BEDROOM, () => {
  bedroomScene.visible = true;
  rangeScene.visible = false;

  thirdPerson.setColliders([...(bedroomScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(bedroomBounds);
  thirdPerson.enable();
  interaction.enable();

  // Update door prompt based on outfit state
  if (gameState.outfitChanged) {
    doorTrigger.userData.promptText = 'Press E to exit house and go to range';
  } else {
    doorTrigger.userData.promptText = 'Please change into shooting outfit from wardrobe to go to range!';
  }
  interaction.setInteractables([doorTrigger]);

  // Only show wardrobe interaction if outfit not yet changed
  if (!gameState.outfitChanged && wardrobe) {
    interaction.setTertiaryInteractables([wardrobe]);
  } else {
    interaction.setTertiaryInteractables([]);
  }

  // Dog petting interaction
  if (dogGroup) {
    interaction.setPetInteractables([dogGroup]);
  }
});

interaction.onInteract = (type) => {
  if (type === 'door_to_range' && fsm.is(STATES.BEDROOM)) {
    if (!gameState.outfitChanged) {
      // Prompt already shows the outfit message — just don't transition
      return;
    }
    fsm.transition(STATES.ENTERING_RANGE);
  }
  if (type === 'door_to_bedroom' && (fsm.is(STATES.PICKUP_RIFLE) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE))) {
    fsm.transition(STATES.RETURNING_BEDROOM);
  }
  if (type === 'rifle' && fsm.is(STATES.PICKUP_RIFLE)) {
    fsm.transition(STATES.SHOOTING);
  }
};

interaction.onSecondaryInteract = (type) => {
  if (type === 'guidelines') {
    guidelinesOverlay.show();
  }
};

interaction.onTertiaryInteract = (type) => {
  if (type === 'wardrobe' && fsm.is(STATES.BEDROOM) && !gameState.outfitChanged) {
    swapOutfit(character, 'shooting');
    gameState.outfitChanged = true;
    interaction.setTertiaryInteractables([]);
    // Update door prompt now that outfit is changed
    doorTrigger.userData.promptText = 'Press E to exit house and go to range';
    interaction.showPrompt('Changed into shooting outfit!');
    setTimeout(() => interaction.hidePrompt(), 2000);
  }
};

// --- Petting interaction ---
let petAnimTimer = 0;
let isPettingAnim = false;

interaction.onPetInteract = (dogObj) => {
  if (!dogAI || dogAI.isPetting() || isPettingAnim) return;
  dogAI.startPetting();
  isPettingAnim = true;
  petAnimTimer = 2.5;
  interaction.showPrompt('Petting Bruno...');
};

fsm.on(STATES.ENTERING_RANGE, async () => {
  thirdPerson.disable();
  interaction.disable();

  // Exit pointer lock during transition (desktop only)
  if (!isMobile && document.pointerLockElement) {
    document.exitPointerLock();
  }

  await fadeToBlack();

  // Switch scene visibility
  bedroomScene.visible = false;
  rangeScene.visible = true;

  // Teleport to range
  gameState.playerPosition.copy(rangeSpawn);
  character.position.copy(rangeSpawn);
  gameState.inRange = true;

  // Face down the range (-Z direction)
  // azimuth=0 puts camera at +Z looking toward -Z (down range)
  thirdPerson.azimuth = 0;
  character.rotation.y = Math.PI;

  thirdPerson.setColliders([...(rangeScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(rangeBounds);

  await fadeFromBlack();

  // Show guidelines on first visit, skip on re-entry
  if (guidelinesFirstView) {
    fsm.transition(STATES.GUIDELINES);
  } else {
    fsm.transition(STATES.PICKUP_RIFLE);
  }
});

fsm.on(STATES.GUIDELINES, () => {
  thirdPerson.disable();
  guidelinesOverlay.show();
});

let guidelinesFirstView = true;
guidelinesOverlay.onClose = () => {
  if (guidelinesFirstView) {
    guidelinesFirstView = false;
    fsm.transition(STATES.PICKUP_RIFLE);
  }
};

fsm.on(STATES.PICKUP_RIFLE, () => {
  thirdPerson.azimuth = 0;
  thirdPerson.setCameraBounds(rangeBounds);
  thirdPerson.enable();
  interaction.enable();
  interaction.setInteractables([rangeScene.userData.rifle, rangeDoorTrigger]);
  interaction.setSecondaryInteractables([rangeScene.userData.clipboard]);
});

fsm.on(STATES.RETURNING_BEDROOM, async () => {
  thirdPerson.disable();
  interaction.disable();

  if (!isMobile && document.pointerLockElement) {
    document.exitPointerLock();
  }

  await fadeToBlack();

  // Switch scenes
  rangeScene.visible = false;
  bedroomScene.visible = true;

  // Teleport to bedroom center
  const bedroomPos = new THREE.Vector3(PLAYER.SPAWN.x, 0, PLAYER.SPAWN.z);
  gameState.playerPosition.copy(bedroomPos);
  character.position.copy(bedroomPos);
  gameState.inRange = false;

  thirdPerson.azimuth = 0;
  character.rotation.y = 0;

  thirdPerson.setColliders([...(bedroomScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(bedroomBounds);

  await fadeFromBlack();

  fsm.transition(STATES.BEDROOM);
});

fsm.on(STATES.SHOOTING, () => {
  thirdPerson.disable();
  interaction.disable();

  // Request pointer lock (desktop only)
  if (!isMobile) {
    renderer.domElement.requestPointerLock();
  }

  // Hide character
  character.visible = false;

  // Position camera at shooting position (standing at bench)
  const shootPos = new THREE.Vector3(
    RANGE.ORIGIN.x,
    PLAYER.HEIGHT,
    RANGE.ORIGIN.z + RANGE.DEPTH / 2 - 3
  );

  // Hide rifle from table
  if (rangeScene.userData.rifle) {
    rangeScene.userData.rifle.visible = false;
  }

  // Create FPS rifle attached to camera
  const fpsRifle = createFPSRifle();
  camera.add(fpsRifle);
  scene.add(camera); // needed to render camera children
  shootingSystem.rifleModel = fpsRifle;

  // Transition camera — both start and end look down the range (-Z)
  const startPos = camera.position.clone();
  const lookTarget = new THREE.Vector3(
    RANGE.ORIGIN.x,
    PLAYER.HEIGHT,
    RANGE.ORIGIN.z - RANGE.DEPTH / 2
  );
  const startLook = lookTarget.clone();
  const endLook = lookTarget.clone();

  transition.startTransition(startPos, shootPos, startLook, endLook, 1, () => {
    firstPerson.rifleModel = fpsRifle;
    firstPerson.enable(0);
    shootingSystem.enable();
    targetDodge.enable();
    hud.showCrosshair();
    hud.showHitCounter(yesHitCount, YES_HITS_REQUIRED);
    if (isMobile) {
      // Show FPS mobile buttons and aim hint, hide joystick
      document.getElementById('mobile-shoot-btn').style.display = 'block';
      document.getElementById('mobile-aim-btn').style.display = 'block';
      document.getElementById('mobile-aim-hint').style.display = 'block';
      document.getElementById('mobile-joystick-zone').style.display = 'none';
      // Expand camera zone to full screen for FPS aiming
      const camZone = document.getElementById('mobile-camera-zone');
      camZone.style.width = '100%';
      camZone.style.left = '0';
      camZone.style.right = '0';
      // Fade out aim hint after a few seconds
      setTimeout(() => {
        const hint = document.getElementById('mobile-aim-hint');
        if (hint) hint.style.display = 'none';
      }, 4000);
    } else {
      // Show focus hint briefly
      const focusHint = document.getElementById('focus-hint');
      focusHint.textContent = 'Press F to focus / zoom in';
      focusHint.style.display = 'block';
      setTimeout(() => { focusHint.style.display = 'none'; }, 4000);
    }
  });

  gameState.riflePickedUp = true;
});

shootingSystem.onHitYes = () => {
  // handled by click event
};

fsm.on(STATES.CELEBRATION, async () => {
  shootingSystem.disable();
  targetDodge.disable();
  firstPerson.disable();
  hud.hideCrosshair();

  if (isMobile) {
    document.getElementById('mobile-shoot-btn').style.display = 'none';
    document.getElementById('mobile-aim-btn').style.display = 'none';
    document.getElementById('mobile-aim-hint').style.display = 'none';
    // Reset camera zone back to right half for third-person
    const camZone = document.getElementById('mobile-camera-zone');
    camZone.style.width = '50%';
    camZone.style.left = '';
    camZone.style.right = '0';
  }

  // Exit pointer lock
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }

  await whiteFlash();

  // Start confetti
  celebration.startConfetti(new THREE.Vector3(
    RANGE.ORIGIN.x,
    PLAYER.HEIGHT + 1,
    RANGE.ORIGIN.z
  ));

  // Show message
  celebrationOverlay.show();

  // Final notification
  sendTelegram("She shot all 3 YES targets! Valentine invite accepted! \u2764\uFE0F");
});

celebrationOverlay.onContinue = () => {
  fsm.transition(STATES.POST_CELEBRATION);
};

fsm.on(STATES.POST_CELEBRATION, () => {
  // Decorate range
  celebration.decorateRange(rangeScene);

  if (isMobile) {
    document.getElementById('mobile-joystick-zone').style.display = 'block';
  }

  // Remove FPS rifle from camera
  while (camera.children.length > 0) {
    camera.remove(camera.children[0]);
  }

  // Show character again
  character.visible = true;
  character.position.copy(rangeSpawn);
  gameState.playerPosition.copy(rangeSpawn);

  // Back to third person
  thirdPerson.setColliders(rangeScene.userData.colliders || []);
  thirdPerson.setCameraBounds(rangeBounds);
  thirdPerson.azimuth = 0;
  thirdPerson.enable();
  interaction.enable();
  interaction.setInteractables([rangeDoorTrigger]);
  interaction.setSecondaryInteractables([rangeScene.userData.clipboard]);

  gameState.rangeDecorated = true;

  // After a brief moment, show share
  setTimeout(() => {
    fsm.transition(STATES.SHARE);
  }, 2000);
});

fsm.on(STATES.SHARE, () => {
  shareOverlay.show();
});

// --- Loading / Start / Key Gate ---
const loadingScreen = document.getElementById('loading-screen');
const startScreen = document.getElementById('start-screen');
const keyScreen = document.getElementById('key-screen');
const keyInput = document.getElementById('key-input');
const keyError = document.getElementById('key-error');
const keySubmit = document.getElementById('key-submit');

const SECRET_KEY = 'OnionRingsOnFirst';

// Simulate brief load
setTimeout(() => {
  loadingScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}, 800);

function onStartScreenActivate() {
  startScreen.classList.add('hidden');
  keyScreen.classList.add('visible');
  setTimeout(() => keyInput.focus(), 100);
}
startScreen.addEventListener('click', onStartScreenActivate);
if (isMobile) {
  startScreen.addEventListener('touchend', (e) => {
    e.preventDefault();
    onStartScreenActivate();
  });
}

function attemptKeyEntry() {
  const val = keyInput.value.trim();
  if (val === SECRET_KEY) {
    keyScreen.classList.remove('visible');
    keyScreen.style.display = 'none';
    fsm.transition(STATES.BEDROOM);
  } else {
    keyError.textContent = 'That\'s not it. Try again.';
    keyInput.classList.add('shake');
    setTimeout(() => keyInput.classList.remove('shake'), 400);
  }
}

keySubmit.addEventListener('click', attemptKeyEntry);
keyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') attemptKeyEntry();
});

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Also listen for orientation change on mobile
if (isMobile) {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 200);
  });
}

// --- Game loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.getElapsedTime();

  // Inject dynamic dog collider into bedroom colliders each frame
  if (fsm.is(STATES.BEDROOM) && dogAI) {
    const staticColliders = bedroomScene.userData.colliders || [];
    thirdPerson.setColliders([...staticColliders, dogAI.getCollider()]);
  }

  // Feed mobile inputs each frame
  if (isMobile && joystick && touchCam) {
    const dir = joystick.getDirection();
    const camDelta = touchCam.consumeDelta();

    if (fsm.is(STATES.BEDROOM) || fsm.is(STATES.PICKUP_RIFLE) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      thirdPerson.setMobileInput(dir.dx, dir.dz);
      thirdPerson.setMobileCameraInput(camDelta.x, camDelta.y);
    } else if (fsm.is(STATES.SHOOTING)) {
      firstPerson.setMobileLookInput(camDelta.x, camDelta.y);
    }
  }

  // State-dependent updates
  if (fsm.is(STATES.BEDROOM) || fsm.is(STATES.PICKUP_RIFLE) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
    const result = thirdPerson.update(dt, gameState.playerPosition);
    gameState.isMoving = result.isMoving;

    // Petting animation: bob the right arm up/down
    if (isPettingAnim) {
      petAnimTimer -= dt;
      const { rightArm } = character.userData;
      if (rightArm) {
        rightArm.rotation.x = -0.8 + Math.sin(time * 8) * 0.25;
      }
      if (petAnimTimer <= 0) {
        isPettingAnim = false;
        if (rightArm) rightArm.rotation.x = 0;
        interaction.hidePrompt();
      }
      // Don't run normal walk animation during petting
      animateCharacter(character, time, false);
    } else {
      animateCharacter(character, time, gameState.isMoving);
    }

    if (fsm.is(STATES.BEDROOM) || fsm.is(STATES.PICKUP_RIFLE) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      interaction.update(gameState.playerPosition);
    }
  }

  if (fsm.is(STATES.SHOOTING)) {
    firstPerson.update(dt);
    shootingSystem.update(dt);
    const aimRay = shootingSystem.getAimRay();
    targetDodge.update(dt, aimRay);
  }

  // Transition system always updates
  transition.update(dt);

  // Celebration always updates
  celebration.update(dt);

  // Dog AI (only when bedroom visible)
  if (bedroomScene.visible && dogAI) {
    dogAI.setPlayerPos(gameState.playerPosition);
    dogAI.update(dt, time);
  }

  renderer.render(scene, camera);
}

animate();
