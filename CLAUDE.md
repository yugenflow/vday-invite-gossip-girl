# VDay in NYC

## Project Overview
A personalized Valentine's Day invite disguised as a browser-based 3D mini-game. The recipient explores a Gossip Girl-inspired Upper East Side luxury apartment, walks through a wardrobe door onto a fashion runway, and strikes a pose on spotlight spots labeled "Yes" / "No" to answer "Will you be my Valentine?" -- with a twist: the "No" spots dodge away and are impossible to pose on.

## Game Flow (Storyboard)

### Scene 1 - The Apartment (Third Person)
- Player spawns in a luxury Blair Waldorf-style Upper East Side apartment
- Props: bed with blush bedding, vanity mirror with bulbs, designer bags (Hermes-style), headbands, art deco paintings, macarons, soft toys, a ginger cat, book rack, guitar, laptop, plants, fairy lights, wardrobe
- A wardrobe door leads to the runway
- Player moves character using WASD/arrow keys, camera follows in third person

### Scene 2 - The Wardrobe Transition
- Player walks through the wardrobe door
- Character outfit changes from blush pink pajamas to a runway outfit (LBD, lace bralette detail, heels with red soles, gold clutch)
- Scene transitions to the fashion runway

### Scene 3 - The Runway
- Player enters a dark, dramatic fashion show venue
- VOGUE banners line the walls, spotlights illuminate the runway
- Paparazzi cameras on tripods, an audience section
- Gold "YES" pose spots and red "NO" pose spots are placed along the runway

### Scene 4 - Striking a Pose
- Player walks onto pose spots
- "No" spots: dodge / slide away when the player gets close (unhittable)
- Flirty dodge messages appear ("Not this spot, darling!", "That spot is SO last season.")
- "Yes" spot: when player steps on it, character strikes a pose and celebration triggers

### Scene 5 - Celebration
- Confetti, hearts, particle effects
- Gossip Girl blast narration appears on screen
- Personal message displayed
- Prateek character appears on the runway for a surprise scene

### Scene 6 - Share
- Email invite overlay with personalized message
- Shareable link (copy to clipboard)
- Telegram notification sent to Prateek when "Yes" is hit

## Design / Aesthetic
- **Style**: Low-poly procedural geometry (all built with Three.js primitives, no external models)
- **Palette**: Warm blush/gold/cream for apartment; dark dramatic blacks/golds for runway; pinks/reds/golds for celebration
- **Lighting**: Soft ambient + fairy lights in apartment; dramatic spotlights on runway; warm glow post-celebration
- **Theme**: Gossip Girl / Upper East Side luxury fashion

### Character Design
- **Hair**: Black, tied in a ponytail
- **Skin tone**: Fair/wheatish
- **Apartment outfit**: Blush pink pajamas with fuzzy slippers
- **Runway outfit**: Black LBD with lace bralette detail, black heels with red soles (Louboutin-style), gold clutch, black-frame glasses
- **Prateek (surprise scene)**: Separate character model that appears post-celebration

### Apartment Props (Personalized)
- Bed with blush/pink cozy bedding and pillows
- Hollywood-style vanity mirror with light bulbs
- Designer bags (orange, black, cream -- Hermes-inspired)
- Satin/velvet/pearl headbands on display
- Art deco paintings in gold frames
- Macarons in pastel colors on a plate
- Soft toys on the bed
- Ginger cat (animated, idle movement)
- Book rack mounted on wall
- Guitar on a stand
- Laptop on desk
- Plants in pots
- Fairy lights along walls
- Full-length mirror
- Wardrobe with gold accents (serves as door to runway)
- Warm ambient lighting (lamp, fairy lights)

## Features
- Third-person character controller (WASD + mouse)
- Scene transitions (apartment -> runway) with outfit change
- Pose spot mechanics with "No" dodge logic
- Gossip Girl-themed narration and UI text
- Celebration sequence (confetti, hearts, message, Prateek surprise)
- Email invite overlay system
- Telegram Bot notification on "Yes"
- Mobile touch controls with virtual joystick
- Shareable result link

## Tech Stack
- **Engine**: Three.js (browser-based 3D, all procedural geometry)
- **Build Tool**: Vite
- **Language**: JavaScript (ES modules)
- **Hosting**: Vercel (auto-deploy from master)
- **Notifications**: Telegram Bot API via environment variables
- **No backend required** -- fully client-side

## Architecture Notes
- Single-page app, all assets bundled by Vite
- Scene management: state machine (apartment -> runway -> posing -> celebration)
- All 3D geometry procedurally generated with Three.js primitives (BoxGeometry, SphereGeometry, CylinderGeometry, etc.)
- No external 3D model files -- everything is code-generated
- Mobile support with virtual joystick and touch controls
- Environment variables for sensitive credentials (Telegram tokens)
- All personalized names configured via env vars in `src/config.js` (VITE_SENDER_NAME, VITE_RECIPIENT_NAME, VITE_RECIPIENT_PETNAME, VITE_RECIPIENT_FULL_NAME)
- `gossipgirlblast.txt` uses `{{PETNAME}}` and `{{NAME_HINT}}` placeholders, replaced at runtime by `GuidelinesOverlay.js`

## Project Structure
```
src/
├── main.js              # Entry point, game loop
├── config.js            # Name personalization (env vars)
├── constants.js         # Colors, dimensions, messages, config
├── character/           # CharacterModel.js, PrateekModel.js
├── controls/            # ThirdPersonController.js, MobileControls.js
├── scenes/              # ApartmentScene.js, RunwayScene.js
├── props/               # All 3D props (20+ files)
├── state/               # GameState.js, GameStateMachine.js
├── systems/             # Celebration, Interaction, Transition, Pose, SpotDodge
└── ui/                  # GuidelinesOverlay, CelebrationOverlay, EmailOverlay, HUD
```

## Key Messages
- **Celebration**: "OMG you said YES!! Spotted: Cutakshita has a very special plan coming her way from Prateek ;)"
- **GG Narration**: "Spotted on the Upper East Side: Akshita Sharma saying YES to being Prateek's Valentine. Looks like this season's hottest couple just got official. You know you love me. XOXO, Gossip Girl."

## Status
- [x] Brainstorming
- [x] Design finalized
- [x] Implementation
- [ ] Polish & deploy
