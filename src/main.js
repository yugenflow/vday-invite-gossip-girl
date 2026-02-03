import * as THREE from 'three';
import { CAMERA, PLAYER, APARTMENT, RUNWAY, DOOR, POSE_SPOTS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from './constants.js';
import { GameStateMachine, STATES } from './state/GameStateMachine.js';
import { gameState } from './state/GameState.js';
import { createApartmentScene } from './scenes/ApartmentScene.js';
import { createRunwayScene } from './scenes/RunwayScene.js';
import { createCharacter, animateCharacter, swapOutfit, poseCharacter, resetPose, applyMakeup } from './character/CharacterModel.js';
import { CatAI } from './props/Cat.js';
import { ThirdPersonController } from './controls/ThirdPersonController.js';
import { CelebrationSystem } from './systems/CelebrationSystem.js';
import { InteractionSystem } from './systems/InteractionSystem.js';
import { TransitionSystem } from './systems/TransitionSystem.js';
import { PoseSystem } from './systems/PoseSystem.js';
import { SpotDodgeSystem } from './systems/SpotDodgeSystem.js';
import { HUD } from './ui/HUD.js';
import { GuidelinesOverlay } from './ui/GuidelinesOverlay.js';
import { CelebrationOverlay } from './ui/CelebrationOverlay.js';
import { ShareOverlay } from './ui/ShareOverlay.js';
import { EmailOverlay } from './ui/EmailOverlay.js';
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
const apartmentScene = createApartmentScene();
scene.add(apartmentScene);

const runwayScene = createRunwayScene();
scene.add(runwayScene);
runwayScene.visible = false;

// --- Character ---
const character = createCharacter();
character.position.set(PLAYER.SPAWN.x, 0, PLAYER.SPAWN.z);
scene.add(character);

// --- Wardrobe interactable (tertiary, C key) ---
const wardrobe = apartmentScene.userData.wardrobe;
if (wardrobe) {
  wardrobe.userData.tertiaryInteractable = true;
  wardrobe.userData.tertiaryType = 'wardrobe';
  wardrobe.userData.tertiaryPromptText = 'Press C to change into runway outfit';
}

// --- Laptop interactable (primary, E key) ---
const laptop = apartmentScene.userData.laptop;

// --- Makeup kit interactable (secondary, R key) ---
const makeupKit = apartmentScene.userData.makeupKit;

// --- Cat AI ---
let catGroup = apartmentScene.userData.cat || null;
let catAI = catGroup ? new CatAI(catGroup, apartmentScene.userData.colliders || [], {
  minX: APARTMENT.ORIGIN.x - APARTMENT.WIDTH / 2,
  maxX: APARTMENT.ORIGIN.x + APARTMENT.WIDTH / 2,
  minZ: APARTMENT.ORIGIN.z - APARTMENT.DEPTH / 2,
  maxZ: APARTMENT.ORIGIN.z + APARTMENT.DEPTH / 2,
}) : null;

// --- Door interactable (invisible trigger in apartment) ---
const doorTrigger = new THREE.Group();
const doorZ = APARTMENT.ORIGIN.z - APARTMENT.DEPTH / 2;
doorTrigger.position.set(DOOR.POSITION.x, 1, doorZ);
doorTrigger.userData.interactable = true;
doorTrigger.userData.interactionType = 'door_to_runway';
doorTrigger.userData.promptText = 'Please change into runway outfit from wardrobe first!';
scene.add(doorTrigger);

// --- Door interactable in runway (back to apartment) ---
const runwayDoorTrigger = new THREE.Group();
const runwayDoorZ = RUNWAY.ORIGIN.z + RUNWAY.DEPTH / 2;
runwayDoorTrigger.position.set(RUNWAY.ORIGIN.x, 1, runwayDoorZ);
runwayDoorTrigger.userData.interactable = true;
runwayDoorTrigger.userData.interactionType = 'door_to_apartment';
runwayDoorTrigger.userData.promptText = 'Press E to go back to apartment';
scene.add(runwayDoorTrigger);

// --- State Machine ---
const fsm = new GameStateMachine();

// --- Systems ---
const thirdPerson = new ThirdPersonController(camera, character, document, isMobile);
const celebration = new CelebrationSystem(scene);
const interaction = new InteractionSystem(isMobile);
const transition = new TransitionSystem(camera);

// --- Mobile controls init ---
let joystick = null;
let touchCam = null;
if (isMobile) {
  joystick = new VirtualJoystick(document.getElementById('mobile-joystick-zone'));
  touchCam = new TouchCameraController(document.getElementById('mobile-camera-zone'));

  // Mobile pose button
  const poseBtnEl = document.getElementById('mobile-pose-btn');
  if (poseBtnEl) {
    poseBtnEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (fsm.is(STATES.RUNWAY_WALK) && poseSystem) {
        if (poseSystem.isPosing()) {
          poseSystem.tryPose();
          resetPose(character);
          thirdPerson.enable();
        } else {
          poseSystem.tryPose();
        }
      }
    });
  }
}

// --- UI ---
const hud = new HUD();
const guidelinesOverlay = new GuidelinesOverlay();
const celebrationOverlay = new CelebrationOverlay();
const shareOverlay = new ShareOverlay();
const emailOverlay = new EmailOverlay();

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

// --- Pose counter ---
let poseCount = 0;
const POSES_REQUIRED = 3;

// --- Photographer flash system ---
const photographers = runwayScene.userData.photographers || [];
let flashTimers = photographers.map(() => Math.random() * 3 + 1);

function updatePhotographerFlashes(dt) {
  photographers.forEach((photog, i) => {
    flashTimers[i] -= dt;
    const bulb = photog.userData.flashBulb;
    const light = photog.userData.flashLight;
    if (!bulb || !light) return;

    if (flashTimers[i] <= 0) {
      // Fire flash
      bulb.material.emissiveIntensity = 3.0;
      light.intensity = 4.0;
      // Reset timer (random 1.5-5 seconds)
      flashTimers[i] = Math.random() * 3.5 + 1.5;
    } else {
      // Decay flash
      bulb.material.emissiveIntensity *= 0.85;
      light.intensity *= 0.85;
      if (bulb.material.emissiveIntensity < 0.01) bulb.material.emissiveIntensity = 0;
      if (light.intensity < 0.01) light.intensity = 0;
    }
  });
}

// --- Pose System & Spot Dodge System ---
const poseSystem = new PoseSystem(scene, character);
const poseSpots = runwayScene.userData.poseSpots || [];
poseSystem.setPoseSpots(poseSpots);
poseSystem.onPoseStruck = () => onPoseStruck();

const spotDodgeSystem = new SpotDodgeSystem(scene);
spotDodgeSystem.setSpots(poseSpots);

// --- Camera bounds helpers ---
const apartmentBounds = {
  minX: APARTMENT.ORIGIN.x - APARTMENT.WIDTH / 2,
  maxX: APARTMENT.ORIGIN.x + APARTMENT.WIDTH / 2,
  minY: 0,
  maxY: APARTMENT.HEIGHT,
  minZ: APARTMENT.ORIGIN.z - APARTMENT.DEPTH / 2,
  maxZ: APARTMENT.ORIGIN.z + APARTMENT.DEPTH / 2,
};
const runwayBounds = {
  minX: RUNWAY.ORIGIN.x - RUNWAY.WIDTH / 2,
  maxX: RUNWAY.ORIGIN.x + RUNWAY.WIDTH / 2,
  minY: 0,
  maxY: RUNWAY.HEIGHT,
  minZ: RUNWAY.ORIGIN.z - RUNWAY.DEPTH / 2,
  maxZ: RUNWAY.ORIGIN.z + RUNWAY.DEPTH / 2,
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

// --- Reset Camera button ---
const resetCamBtn = document.getElementById('reset-camera-btn');
if (resetCamBtn) {
  resetCamBtn.addEventListener('click', () => {
    thirdPerson.resetCameraBehind();
  });
}

// Show/hide reset camera button based on game state
function updateResetCameraBtn() {
  if (resetCamBtn) {
    const show = fsm.is(STATES.APARTMENT) || fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE);
    resetCamBtn.style.display = show ? 'block' : 'none';
  }
}

// --- Runway spawn point ---
const runwaySpawn = new THREE.Vector3(RUNWAY.ORIGIN.x, 0, RUNWAY.ORIGIN.z + RUNWAY.DEPTH / 2 - 2);

// --- E key for posing on runway (desktop) ---
if (!isMobile) {
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && fsm.is(STATES.RUNWAY_WALK)) {
      // If currently posing, release the pose
      if (poseSystem.isPosing()) {
        poseSystem.tryPose(); // toggles off
        resetPose(character);
        thirdPerson.enable();
      } else {
        poseSystem.tryPose(); // toggles on
      }
    }
  });
}

// --- Pointer lock on click for third-person (desktop only) ---
if (!isMobile) {
  renderer.domElement.addEventListener('click', () => {
    if (fsm.is(STATES.APARTMENT) || fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      if (!document.pointerLockElement) {
        renderer.domElement.requestPointerLock();
      }
    }
  });
}

// --- State transitions ---
let apartmentFirstEntry = true;

fsm.on(STATES.APARTMENT, () => {
  apartmentScene.visible = true;
  runwayScene.visible = false;

  thirdPerson.setColliders([...(apartmentScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(apartmentBounds);
  thirdPerson.enable();
  interaction.enable();
  updateResetCameraBtn();

  // First time entering apartment - send Telegram and show first task
  if (apartmentFirstEntry) {
    apartmentFirstEntry = false;
    sendTelegram("👗 [UES] Cutakshita has entered her room");
    hud.showTask("Check your work laptop for new mail");
  }

  // Setup interactables based on current game state
  updateApartmentInteractables();

  // Cat petting interaction (once cat is added)
  if (catGroup) {
    interaction.setPetInteractables([catGroup]);
  }
});

function updateApartmentInteractables() {
  const primaryInteractables = [];
  const secondaryInteractables = [];
  const tertiaryInteractables = [];

  // Laptop: only interactable if mail not yet read
  if (!gameState.mailRead && laptop) {
    primaryInteractables.push(laptop);
  }

  // Door: only interactable if fully ready (invite accepted, outfit changed, makeup applied)
  if (gameState.inviteAccepted && gameState.outfitChanged && gameState.makeupApplied) {
    doorTrigger.userData.promptText = 'Press E to head to the runway';
    primaryInteractables.push(doorTrigger);
  } else if (gameState.inviteAccepted) {
    // Show door but with a blocking message
    if (!gameState.outfitChanged) {
      doorTrigger.userData.promptText = 'Change into runway outfit first!';
    } else if (!gameState.makeupApplied) {
      doorTrigger.userData.promptText = 'Apply makeup before heading out!';
    }
    primaryInteractables.push(doorTrigger);
  }

  // Makeup kit: only interactable after outfit changed but before makeup applied
  if (gameState.inviteAccepted && gameState.outfitChanged && !gameState.makeupApplied && makeupKit) {
    secondaryInteractables.push(makeupKit);
  }

  // Wardrobe: only interactable after invite accepted but before outfit changed
  if (gameState.inviteAccepted && !gameState.outfitChanged && wardrobe) {
    tertiaryInteractables.push(wardrobe);
  }

  interaction.setInteractables(primaryInteractables);
  interaction.setSecondaryInteractables(secondaryInteractables);
  interaction.setTertiaryInteractables(tertiaryInteractables);
}

interaction.onInteract = (type) => {
  // Laptop interaction - show email overlay
  if (type === 'laptop' && fsm.is(STATES.APARTMENT) && !gameState.mailRead) {
    sendTelegram("📧 [UES] She is checking her mail...");
    emailOverlay.show();
    thirdPerson.disable();
    if (!isMobile && document.pointerLockElement) {
      document.exitPointerLock();
    }
    return;
  }

  // Door to runway
  if (type === 'door_to_runway' && fsm.is(STATES.APARTMENT)) {
    if (!gameState.inviteAccepted || !gameState.outfitChanged || !gameState.makeupApplied) {
      // Show blocking message - already set in updateApartmentInteractables
      return;
    }
    sendTelegram("🚪 [UES] Entered the runway!!");
    hud.hideTask();
    fsm.transition(STATES.ENTERING_RUNWAY);
  }
  if (type === 'door_to_apartment' && (fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE))) {
    fsm.transition(STATES.RETURNING_APARTMENT);
  }
  if (type === 'pose_spot' && fsm.is(STATES.RUNWAY_WALK)) {
    poseSystem.tryPose();
  }
};

interaction.onSecondaryInteract = (type) => {
  if (type === 'gossip_girl_card') {
    guidelinesOverlay.show();
  }
  // Makeup interaction
  if (type === 'makeup' && fsm.is(STATES.APARTMENT) && gameState.outfitChanged && !gameState.makeupApplied) {
    gameState.makeupApplied = true;
    applyMakeup(character); // Apply visual makeup to character model
    sendTelegram("💄 [UES] Makeup applied - she's runway ready!");
    hud.showTask("Head to the runway!");
    interaction.showPrompt('Runway makeup applied!');
    setTimeout(() => interaction.hidePrompt(), 2000);
    updateApartmentInteractables();
  }
};

interaction.onTertiaryInteract = (type) => {
  if (type === 'wardrobe' && fsm.is(STATES.APARTMENT) && gameState.inviteAccepted && !gameState.outfitChanged) {
    swapOutfit(character, 'runway');
    gameState.outfitChanged = true;
    sendTelegram("👗 [UES] Getting runway ready - outfit changed!");
    hud.showTask("Apply makeup for the runway");
    interaction.showPrompt('Changed into runway outfit!');
    setTimeout(() => interaction.hidePrompt(), 2000);
    updateApartmentInteractables();
  }
};

// --- Petting interaction ---
let petAnimTimer = 0;
let isPettingAnim = false;

interaction.onPetInteract = (catObj) => {
  if (!catAI || catAI.isPetting() || isPettingAnim) return;
  catAI.startPetting();
  isPettingAnim = true;
  petAnimTimer = 2.5;
  interaction.showPrompt('Petting Nugget...');
};

// --- Email overlay callbacks ---
emailOverlay.onAccept = () => {
  gameState.mailRead = true;
  gameState.inviteAccepted = true;
  sendTelegram("✅ [UES] Runway invite ACCEPTED!");
  hud.showTask("Change into your runway outfit");
  thirdPerson.enable();
  updateApartmentInteractables();
};

emailOverlay.onDecline = () => {
  gameState.mailRead = true;
  gameState.inviteAccepted = false;
  showRejectionPopup();
};

function showRejectionPopup() {
  const rejectionOverlay = document.getElementById('rejection-overlay');
  const countdownEl = document.getElementById('countdown');
  if (rejectionOverlay) {
    rejectionOverlay.classList.add('visible');
    let countdown = 5;
    countdownEl.textContent = countdown;
    const interval = setInterval(() => {
      countdown--;
      countdownEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(interval);
        location.reload();
      }
    }, 1000);
  }
}

let ggBlastFirstView = true;

fsm.on(STATES.ENTERING_RUNWAY, async () => {
  thirdPerson.disable();
  interaction.disable();

  if (!isMobile && document.pointerLockElement) {
    document.exitPointerLock();
  }

  await fadeToBlack();

  apartmentScene.visible = false;
  runwayScene.visible = true;

  gameState.playerPosition.copy(runwaySpawn);
  character.position.copy(runwaySpawn);
  gameState.inRunway = true;

  thirdPerson.azimuth = 0;
  character.rotation.y = Math.PI;

  thirdPerson.setColliders([...(runwayScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(runwayBounds);

  await fadeFromBlack();

  if (ggBlastFirstView) {
    fsm.transition(STATES.GOSSIP_GIRL_BLAST);
  } else {
    fsm.transition(STATES.RUNWAY_WALK);
  }
});

fsm.on(STATES.GOSSIP_GIRL_BLAST, () => {
  thirdPerson.disable();
  guidelinesOverlay.show();
});

guidelinesOverlay.onClose = () => {
  if (ggBlastFirstView) {
    ggBlastFirstView = false;
    fsm.transition(STATES.RUNWAY_WALK);
  }
};

fsm.on(STATES.RUNWAY_WALK, () => {
  thirdPerson.azimuth = 0;
  thirdPerson.setCameraBounds(runwayBounds);
  thirdPerson.enable();
  interaction.enable();
  updateResetCameraBtn();

  const interactables = [runwayDoorTrigger];
  interaction.setInteractables(interactables);

  // GG card for re-reading
  const ggCard = runwayScene.userData.ggCard;
  if (ggCard) {
    interaction.setSecondaryInteractables([ggCard]);
  }

  // Enable pose and dodge systems
  poseSystem.enable();
  spotDodgeSystem.enable();

  hud.showHitCounter(poseCount, POSES_REQUIRED);
  hud.showTask(`Strike a pose on the YES spots! (${poseCount}/${POSES_REQUIRED})`);

  if (isMobile) {
    const poseBtnEl = document.getElementById('mobile-pose-btn');
    if (poseBtnEl) poseBtnEl.style.display = 'block';
  }
});

fsm.on(STATES.RETURNING_APARTMENT, async () => {
  thirdPerson.disable();
  interaction.disable();

  if (!isMobile && document.pointerLockElement) {
    document.exitPointerLock();
  }

  if (isMobile) {
    const poseBtnEl = document.getElementById('mobile-pose-btn');
    if (poseBtnEl) poseBtnEl.style.display = 'none';
  }

  await fadeToBlack();

  runwayScene.visible = false;
  apartmentScene.visible = true;

  const apartmentPos = new THREE.Vector3(PLAYER.SPAWN.x, 0, PLAYER.SPAWN.z);
  gameState.playerPosition.copy(apartmentPos);
  character.position.copy(apartmentPos);
  gameState.inRunway = false;

  thirdPerson.azimuth = 0;
  character.rotation.y = 0;

  thirdPerson.setColliders([...(apartmentScene.userData.colliders || [])]);
  thirdPerson.setCameraBounds(apartmentBounds);

  await fadeFromBlack();

  fsm.transition(STATES.APARTMENT);
});

// --- Pose handling ---
function onPoseStruck() {
  poseCount++;
  hud.showHitCounter(poseCount, POSES_REQUIRED);
  hud.showTask(`Strike a pose on the YES spots! (${poseCount}/${POSES_REQUIRED})`);

  // Pose animation — hold until player presses E again
  poseCharacter(character, poseCount - 1);
  thirdPerson.disable(); // freeze movement while posing

  if (poseCount >= POSES_REQUIRED) {
    // Final pose - send special telegram
    sendTelegram("🎉 [UES] 3/3 YES! Valentine invite accepted! ❤️");
    hud.hideTask();
    // Auto-release pose after a brief moment then celebrate
    setTimeout(() => {
      resetPose(character);
      fsm.transition(STATES.CELEBRATION);
    }, 1500);
  } else {
    // Individual pose telegrams
    sendTelegram(`📸 [UES] ${poseCount}/${POSES_REQUIRED} Poses struck! 💃`);
  }
}

fsm.on(STATES.CELEBRATION, async () => {
  thirdPerson.disable();
  interaction.disable();
  poseSystem.disable();
  spotDodgeSystem.disable();
  hud.hideHitCounter();

  if (isMobile) {
    const poseBtnEl = document.getElementById('mobile-pose-btn');
    if (poseBtnEl) poseBtnEl.style.display = 'none';
  }

  if (document.pointerLockElement) {
    document.exitPointerLock();
  }

  await whiteFlash();

  celebration.startConfetti(new THREE.Vector3(
    RUNWAY.ORIGIN.x,
    PLAYER.HEIGHT + 1,
    RUNWAY.ORIGIN.z
  ));

  celebrationOverlay.show();

  sendTelegram("\uD83D\uDCF8 Akshita struck all 3 poses! Valentine invite accepted! \u2764\uFE0F\uD83D\uDC83");
});

celebrationOverlay.onContinue = () => {
  fsm.transition(STATES.POST_CELEBRATION);
};

fsm.on(STATES.POST_CELEBRATION, () => {
  celebration.decorateRunway(runwayScene);

  if (isMobile) {
    document.getElementById('mobile-joystick-zone').style.display = 'block';
  }

  character.visible = true;
  character.position.copy(runwaySpawn);
  gameState.playerPosition.copy(runwaySpawn);

  thirdPerson.setColliders(runwayScene.userData.colliders || []);
  thirdPerson.setCameraBounds(runwayBounds);
  thirdPerson.azimuth = 0;
  thirdPerson.enable();
  interaction.enable();
  interaction.setInteractables([runwayDoorTrigger]);

  gameState.runwayDecorated = true;

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

const SECRET_KEY = 'ComeToDaddy';

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
    fsm.transition(STATES.APARTMENT);
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

  // Inject dynamic cat collider into apartment colliders each frame
  if (fsm.is(STATES.APARTMENT) && catAI) {
    const staticColliders = apartmentScene.userData.colliders || [];
    thirdPerson.setColliders([...staticColliders, catAI.getCollider()]);
  }

  // Feed mobile inputs each frame
  if (isMobile && joystick && touchCam) {
    const dir = joystick.getDirection();
    const camDelta = touchCam.consumeDelta();

    if (fsm.is(STATES.APARTMENT) || fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      thirdPerson.setMobileInput(dir.dx, dir.dz);
      thirdPerson.setMobileCameraInput(camDelta.x, camDelta.y);
    }
  }

  // State-dependent updates
  if (fsm.is(STATES.APARTMENT) || fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
    const result = thirdPerson.update(dt, gameState.playerPosition);
    gameState.isMoving = result.isMoving;

    // Petting animation
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
      animateCharacter(character, time, false);
    } else {
      animateCharacter(character, time, gameState.isMoving);
    }

    if (fsm.is(STATES.APARTMENT) || fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE)) {
      interaction.update(gameState.playerPosition);
    }
  }

  // Transition system always updates
  transition.update(dt);

  // Celebration always updates
  celebration.update(dt);

  // Cat AI (only when apartment visible)
  if (apartmentScene.visible && catAI) {
    catAI.setPlayerPos(gameState.playerPosition);
    catAI.update(dt, time);
  }

  // Pose and spot dodge systems
  if (fsm.is(STATES.RUNWAY_WALK)) {
    poseSystem.update(dt);
    spotDodgeSystem.update(dt, gameState.playerPosition);
  }

  // Photographer flashes (when runway is visible)
  if (runwayScene.visible && (fsm.is(STATES.RUNWAY_WALK) || fsm.is(STATES.POST_CELEBRATION) || fsm.is(STATES.SHARE))) {
    updatePhotographerFlashes(dt);
  }

  renderer.render(scene, camera);
}

animate();
