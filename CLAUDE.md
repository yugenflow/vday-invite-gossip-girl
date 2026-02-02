# VDay-Invite

## Project Overview
A personalized Valentine's Day invite disguised as a browser-based 3D mini-game. The recipient (a rifle shooter by hobby and profession) navigates through a cozy bedroom into a shooting range, picks up a rifle, and shoots targets labeled "Yes" / "No" to answer "Will you be my Valentine?" - with a twist: the "No" targets are unhittable.

## Game Flow (Storyboard)

### Scene 1 - The Bedroom (Third Person)
- Player spawns in a cozy, detailed low-poly bedroom
- Props: bed, desk, posters, warm lighting, shooting trophies/medals as Easter eggs
- A door leads to the shooting range
- Player moves character using WASD/arrow keys, camera follows

### Scene 2 - Entering the Range
- Player walks through the door into the shooting range
- Pop-up appears: "Before you start shooting, please read the range guidelines."
- A guidelines booklet/clipboard is visible - player interacts with it

### Scene 3 - The Guidelines (First Person / Document View)
- Switches to a first-person document view
- Displays the custom guidelines text (content in `guidelines.txt`)
- Player closes the document when done reading

### Scene 4 - The Rifle (Transition to FPS)
- Player can now pick up the rifle on a table/rack
- View switches to first-person shooter mode
- A banner is visible in the range: "Will you be my Valentine?"
- Multiple targets downrange labeled "Yes" and "No"

### Scene 5 - Shooting
- Player aims and shoots at targets
- "No" targets: dodge / disappear / move away right before the bullet hits (unhittable)
- "Yes" target: when hit, triggers celebration

### Scene 6 - Celebration
- Confetti, particle effects, screen flash
- A personal message appears on screen (from the sender)
- When exiting back to third person, the range is transformed: hearts, fairy lights, decorations replace the targets
- Player can walk around the decorated range

### Scene 7 - Share
- A "Share your result" button appears
- Generates a copyable link / pre-filled message she can send

## Design / Aesthetic
- **Style**: Low-poly / voxel inspired (Roblox/Minecraft feel) but with good detailing and warm aesthetics
- **Palette**: Warm, cozy tones for bedroom; cooler/industrial for the range; pinks/reds/golds for celebration
- **Lighting**: Soft ambient in bedroom, bright fluorescent in range, warm fairy-light glow post-celebration

### Character Design
- **Hair**: Black, tied in a ponytail with a half-cap (shooter-style visor cap)
- **Skin tone**: Fair/wheatish
- **Shooting jacket (back)**: White base with red/black color blocking on the lats
- **Shooting jacket (front)**: Mostly black/red/dark gray color blocking
- **Sleeves**: Red with black blocking around shoulder/upper arm area
- **Pants**: Red and white color blocking
- **Rifle**: Long-range 50m competition rifle, silver colored

### Bedroom Props (Personalized)
- Bed with cozy bedding
- Desk with items on it
- Book rack mounted on wall above the desk
- Mirror on the wall
- Keyboard on a stand (musical keyboard)
- Paintings on walls
- A Labrador dog (can be lying on bed or near the desk, maybe wags tail)
- Shooting trophies/medals as Easter eggs
- Warm ambient lighting (lamp on desk, fairy lights, etc.)

## Features
- Third-person character controller (WASD + mouse)
- Scene transitions (bedroom -> range)
- Document/UI overlay for guidelines
- First-person shooter mechanics (aim + shoot)
- Target hit detection with "No" dodge logic
- Celebration sequence (confetti, message, environment transformation)
- Shareable result link (no backend needed)

## Tech Stack
- **Engine**: Three.js (browser-based 3D, no install needed)
- **Language**: JavaScript/TypeScript
- **Hosting**: Netlify / GitHub Pages / Vercel (static, free)
- **Notification**: Shareable link (copy to clipboard)
- **No backend required** - fully client-side

## Architecture Notes
- Single-page app, all assets bundled
- Scene management: state machine (bedroom -> range -> fps -> celebration)
- Assets: low-poly 3D models (procedurally generated or minimal glTF)
- Physics: simple raycasting for shooting, no heavy physics engine needed
- Mobile support: TBD (nice to have, but primary target is desktop)

## Celebration Message
"Wow you hit Yes!! That means you've got a good plan coming your way from Prateek ;)"

## Open Items
- [x] Character appearance details (hair, outfit, etc.)
- [x] Guidelines document content (`guidelines.txt`)
- [x] Personal message for celebration screen
- [x] Bedroom decoration details
- [x] Notification approach: share result link first, Telegram integration later (Phase 2)
- [x] Fix minor typos in guidelines.txt

## Status
- [x] Brainstorming
- [ ] Design finalized
- [ ] Implementation
- [ ] Polish & deploy
