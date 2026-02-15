export const PHYSICS = {
  GRAVITY: { x: 0.0, y: -9.81, z: 0.0 },
  TIMESTEP: 1 / 60,
  COIN_RADIUS: 0.55,
  COIN_HEIGHT: 0.1, // Thinner for realistic stacking
  PUSHER_AMPLITUDE: 1.1,
  PUSHER_PERIOD: 4.0, // Slower, heavier machine feel
  COIN_FRICTION: 0.3, // Lower friction allows sliding/avalanches
  COIN_RESTITUTION: 0.2, // Metallic clink
  COIN_LINEAR_DAMPING: 0.1,
  COIN_ANGULAR_DAMPING: 1.5, // Stop spinning relatively fast
  MAX_COINS: 800,
  COIN_DENSITY: 5.0, // High density for weight
};

export const DIMENSIONS = {
  PLAYFIELD_WIDTH: 8,
  PLAYFIELD_LENGTH: 10,
  WALL_HEIGHT: 2,
};

export const TRASHCOIN = {
  MAX_COUNT: 10,
  SPAWN_CHANCE: 0.06, // 6% chance a spawned coin is a trashcoin
  SCORE_VALUE: 5, // Worth 5x a normal coin
  RIM_COLOR: 0xdaa520, // Goldenrod rim
};

export const COLORS = {
  COIN: 0xe8a317, // JUNK token amber/orange
  FLOOR: 0x2a2a35, // Significantly lighter floor (dark slate blue)
  PUSHER: 0x606070, // Much lighter pusher (visible grey)
  CABINET: 0x333340, // Lighter cabinet walls
  LIGHT_AMBIENT: 0xffffff, // White ambient
  LIGHT_MAIN: 0xfff0dd, // Bright warm spotlight
};