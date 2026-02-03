// Colors — Upper East Side / Gossip Girl palette
export const COLORS = {
  // Apartment (Blair Waldorf luxury)
  FLOOR_WOOD: 0x8B6F5E,
  WALL: 0xFAF0E6,
  CEILING: 0xFFF8F0,
  ACCENT_GOLD: 0xD4AF37,
  ACCENT_BLUSH: 0xF5C6C6,
  TRIM_WHITE: 0xF5F0EB,
  BED_FRAME: 0xF5F0EB,
  BED_SHEET: 0xFFF0F5,
  BLANKET: 0xE8B4D0,
  PILLOW: 0xFFF5EE,
  VANITY_WHITE: 0xF5F0EB,
  VANITY_MIRROR: 0xC8D8E8,
  VANITY_BULB: 0xFFE4B5,
  DESIGNER_BAG_ORANGE: 0xEB6A34,
  DESIGNER_BAG_BLACK: 0x1A1A1A,
  DESIGNER_BAG_CREAM: 0xF5E6D0,
  HEADBAND_SATIN: 0x2B1B5E,
  HEADBAND_VELVET: 0x8B1A4A,
  HEADBAND_PEARL: 0xFFF8DC,
  SOFT_TOY_PINK: 0xFFB6C1,
  SOFT_TOY_BROWN: 0x8B6C42,
  MACARON_PINK: 0xF8C8DC,
  MACARON_MINT: 0xB8E8D0,
  MACARON_LAVENDER: 0xD8C8E8,
  MACARON_YELLOW: 0xFFF0B0,
  CAT_ORANGE: 0xD4881A,
  CAT_ORANGE_LIGHT: 0xE8A030,
  CAT_ORANGE_DARK: 0xB06A10,
  CAT_NOSE: 0xFFB0B0,
  PAINTING_FRAME: 0xD4AF37,
  LAMP_BASE: 0xD4AF37,
  LAMP_SHADE: 0xFFF8F0,
  FAIRY_LIGHT: 0xFFE4B5,
  DOOR: 0xF5F0EB,
  DOOR_FRAME: 0xD4AF37,
  WARDROBE_WHITE: 0xF5F0EB,
  WARDROBE_GOLD: 0xD4AF37,

  // Character
  SKIN: 0xDEB887,
  HAIR: 0x1A1A1A,
  EYES: 0x222222,

  // Casual outfit (blush pink pajamas)
  PAJAMA_BLUSH: 0xF5C6C6,
  PAJAMA_CREAM: 0xFFF0E8,
  SLIPPER_FUZZY: 0xF5C6C6,

  // Runway outfit
  LBD_BLACK: 0x0A0A0A,
  BRALETTE_LACE: 0x1A1A1A,
  BRALETTE_DETAIL: 0x333333,
  GLASSES_FRAME: 0x0A0A0A,
  HEEL_BLACK: 0x0A0A0A,
  HEEL_RED_SOLE: 0xCC0000,
  CLUTCH_GOLD: 0xD4AF37,

  // Runway scene
  RUNWAY_FLOOR: 0x0A0A0A,
  RUNWAY_WALL: 0x1A1A2A,
  RUNWAY_CEILING: 0x151520,
  RUNWAY_PLATFORM: 0x0D0D0D,
  RUNWAY_EDGE_LIGHT: 0xD4AF37,
  SPOTLIGHT_WARM: 0xFFF0D0,
  CAMERA_BODY: 0x333333,
  CAMERA_LENS: 0x111111,
  TRIPOD: 0x444444,
  BACKDROP: 0x2A1A3A,

  // Pose spots
  POSE_SPOT_YES: 0xD4AF37,
  POSE_SPOT_YES_GLOW: 0xFFD700,
  POSE_SPOT_NO: 0x8B0000,
  POSE_SPOT_NO_GLOW: 0xFF2222,

  // Celebration
  HEART_RED: 0xFF2255,
  HEART_PINK: 0xFF69B4,
  CONFETTI_RED: 0xFF3344,
  CONFETTI_PINK: 0xFF88AA,
  CONFETTI_GOLD: 0xFFD700,
  CONFETTI_WHITE: 0xFFFFFF,
  FAIRY_WARM: 0xFFB366,
  ROSE_PETAL: 0xE8284B,
};

// Dimensions
export const APARTMENT = {
  WIDTH: 7,
  DEPTH: 7,
  HEIGHT: 3.2,
  ORIGIN: { x: 0, y: 0, z: 0 },
};

export const RUNWAY = {
  WIDTH: 10,
  DEPTH: 30,
  HEIGHT: 5,
  ORIGIN: { x: 0, y: 0, z: -25 },
};

export const DOOR = {
  WIDTH: 0.9,
  HEIGHT: 1.8,
  POSITION: { x: 0, y: 0, z: -APARTMENT.DEPTH / 2 },
};

// Player
export const PLAYER = {
  HEIGHT: 1.65,
  SPEED: 3.5,
  SPAWN: { x: 0, y: 0, z: 0 },
};

// Camera
export const CAMERA = {
  THIRD_PERSON_OFFSET: { x: 0, y: 2.5, z: 4 },
  FOV: 65,
  NEAR: 0.1,
  FAR: 100,
};

// Pose spots configuration
export const POSE_SPOTS = {
  YES_COUNT: 3,
  NO_COUNT: 5,
  POSE_DURATION: 2.0,
  PROXIMITY: 1.5,
  DODGE_THRESHOLD: 0.7,  // Must be standing inside the spot to trigger
  DODGE_SPEED: 0.3,
  DODGE_WAIT: 0.5,
  DODGE_RETURN: 0.4,
};

// Messages
export const MESSAGES = {
  CELEBRATION: "OMG you said YES!! Spotted: Cutakshita has a very special plan coming her way from Prateek ;)",
  GG_NARRATION: "Spotted on the Upper East Side: Akshita Sharma saying YES to being Prateek's Valentine. Looks like this season's hottest couple just got official. You know you love me. XOXO, Gossip Girl.",
  DODGE_MESSAGES: [
    'Not this spot, darling!', 'A queen knows where to pose~',
    'Try the gold ones, gorgeous!', 'That spot is SO last season.',
    'Nuh uh, Cutakshita!', 'Even Blair would say no to that spot.',
    'Keep walking, supermodel!', 'Wrong spotlight, babe!',
    'The paparazzi want you elsewhere~', 'Fashion faux pas! Try again.',
    'Strike a pose... just not here!', 'Move along, beautiful!',
    'This spot is reserved for nobodies.', 'You deserve a better spot!',
    'XOXO, try again~', 'Gossip Girl says: wrong spot!',
    'The gold spots are calling you!', 'Channel your inner Blair!',
  ],
  FLIRTY_TEXTS: [
    'Serving LOOKS!', 'The camera loves you!',
    'Vogue-worthy, Cutakshita!', 'Blair who?? This is YOUR runway.',
    'Absolutely iconic.', 'The Upper East Side is shaking!',
    'Fashion week has a new star!', 'Work it, gorgeous!',
    'Prateek is one lucky guy ;)', 'Spotted: perfection.',
  ],
};

// Telegram notification
export const TELEGRAM_BOT_TOKEN = '8576846851:AAEC66VGXS3vm7L7PWjAVpdJIII4zh4I2NU';
export const TELEGRAM_CHAT_ID = '2009978277';
