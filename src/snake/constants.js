export const GRID_SIZE = 60
export const RESTART_DELAY = 2500
export const WAVE_FADE_DISTANCE = 2.5
export const WAVE_DURATION = 1000
export const MIN_SWIPE = 30
export const FOOD_SPAWN_DURATION = 400
export const FOOD_PULSE_DURATION = 1500
export const FOOD_GLOW_INTENSITY = 20
export const FOOD_EAT_DURATION = 200

export const COLORS = {
  background: '#0b1c1e',
  snake: '#bbf7d0',
  food: '#ff1744'
}

export const KEY_MAP = {
  'ArrowUp': {x: 0, y: -1, prevent: 1},
  'w': {x: 0, y: -1, prevent: 1},
  'W': {x: 0, y: -1, prevent: 1},
  'ArrowDown': {x: 0, y: 1, prevent: -1},
  's': {x: 0, y: 1, prevent: -1},
  'S': {x: 0, y: 1, prevent: -1},
  'ArrowLeft': {x: -1, y: 0, prevent: 1},
  'a': {x: -1, y: 0, prevent: 1},
  'A': {x: -1, y: 0, prevent: 1},
  'ArrowRight': {x: 1, y: 0, prevent: -1},
  'd': {x: 1, y: 0, prevent: -1},
  'D': {x: 1, y: 0, prevent: -1}
}

