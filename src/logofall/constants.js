// Physics constants
export const PHYSICS = {
  GRAVITY: 0.01,
  DELTA_TIME_NORMALIZER: 8,
  MIN_ANGULAR_VELOCITY_THRESHOLD: 0.005,
  ANGULAR_VELOCITY_FACTOR: 0.6
}

// Collision constants
export const COLLISION = {
  CIRCLE_RECT_ELASTICITY: 1.4,
  CIRCLE_CIRCLE_ELASTICITY: 1.9,
  CIRCLE_RECT_FRICTION: 0.35
}

// Level geometry constants
export const LEVEL = {
  GROUND_WIDTH: 700,
  GROUND_HEIGHT: 2,
  WALL_WIDTH: 2,
  WALL_HEIGHT: 500
}

// Actor constants
export const ACTOR = {
  SPAWN_RADIUS: 25,
  DEFAULT_COLOR: '#bbf7d0',
  SPAWN_Y_OFFSET: -100,
  SPAWN_X_MARGIN: 25
}

// Canvas constants
export const CANVAS = {
  SCALE: 1
}

// Glow effect constants
export const GLOW = {
  INTENSITY: 1.0,           // Initial glow intensity
  DECAY_RATE: 0.05,         // How fast glow fades per frame
  COLOR: '#bbf7d0',         // Glow color
  BLUR_RADIUS: 15,          // Shadow blur radius at max intensity
  MAX_INTENSITY: 1.0,       // Maximum glow intensity
  MAX_OBJECTS_WITH_GLOW: 20 // Maximum number of newest objects that can glow on collision
}

