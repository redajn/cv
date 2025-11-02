import { WAVE_DURATION, WAVE_FADE_DISTANCE } from './constants.js'
import { getCenterPosition } from './utils.js'

export function isValidPosition(x, y, tileCount) {
  return x >= 0 && x < tileCount && y >= 0 && y < tileCount
}

export function willCollideWithSnake(x, y, snake) {
  return snake.some(seg => seg.x === x && seg.y === y)
}

export function generateFoodPosition(tileCount) {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  }
}

export function generateFood(snake, tileCount) {
  let attempts = 0
  let food
  do {
    food = generateFoodPosition(tileCount)
    attempts++
  } while (willCollideWithSnake(food.x, food.y, snake) && attempts < 100)
  return food
}

export function findPathToFood(state, tileCount) {
  const { snake, food, dx, dy } = state
  const head = snake[0]
  const directions = [
    {x: 1, y: 0}, {x: -1, y: 0},
    {x: 0, y: 1}, {x: 0, y: -1}
  ]

  const validDirections = directions.filter(dir => {
    const nextX = head.x + dir.x
    const nextY = head.y + dir.y

    if (!isValidPosition(nextX, nextY, tileCount)) return false
    if (willCollideWithSnake(nextX, nextY, snake)) return false
    if ((dx !== 0 && dir.x === -dx) || (dy !== 0 && dir.y === -dy)) return false

    return true
  })

  if (validDirections.length === 0) {
    return null // Signal game over
  }

  validDirections.sort((a, b) => {
    const distA = Math.abs(head.x + a.x - food.x) + Math.abs(head.y + a.y - food.y)
    const distB = Math.abs(head.x + b.x - food.x) + Math.abs(head.y + b.y - food.y)
    return distA - distB
  })

  for (let dir of validDirections) {
    const nextX = head.x + dir.x
    const nextY = head.y + dir.y
    let isSafe = true

    const futureDirections = [
      {x: 1, y: 0}, {x: -1, y: 0},
      {x: 0, y: 1}, {x: 0, y: -1}
    ]

    for (let futureDir of futureDirections) {
      if (futureDir.x === -dir.x && futureDir.y === -dir.y) continue

      const futureX = nextX + futureDir.x
      const futureY = nextY + futureDir.y

      if (!isValidPosition(futureX, futureY, tileCount)) continue
      if (willCollideWithSnake(futureX, futureY, snake)) {
        isSafe = false
        break
      }
    }

    if (isSafe || validDirections.length === 1) {
      return { dx: dir.x, dy: dir.y }
    }
  }

  if (validDirections.length > 0) {
    return { dx: validDirections[0].x, dy: validDirections[0].y }
  }

  return null
}

export function moveSnake(state, tileCount) {
  if (!state.gameRunning) return state

  let { snake, food, dx, dy, manualControl, score, previousHeadPos } = state
  let foodEatTime = 0
  let headGlowStartTime = state.headGlowStartTime

  // Auto-control: find path
  if (!manualControl) {
    const newDirection = findPathToFood(state, tileCount)
    if (newDirection === null) {
      // Game over
      return { ...state, gameRunning: false }
    }
    dx = newDirection.dx
    dy = newDirection.dy
  }

  const head = {x: snake[0].x + dx, y: snake[0].y + dy}

  if (!isValidPosition(head.x, head.y, tileCount) || willCollideWithSnake(head.x, head.y, snake)) {
    return { ...state, gameRunning: false }
  }

  snake = [{...head}, ...snake]

  if (previousHeadPos && (previousHeadPos.x !== head.x || previousHeadPos.y !== head.y)) {
    headGlowStartTime = 0
  }

  previousHeadPos = {x: head.x, y: head.y}

  if (head.x === food.x && head.y === food.y) {
    score++
    foodEatTime = Date.now()
  } else {
    snake.pop()
  }

  return {
    ...state,
    snake,
    dx,
    dy,
    score,
    previousHeadPos,
    headGlowStartTime,
    foodEatTime
  }
}

export function endGame(state, tileCount) {
  if (!state.gameRunning) return state

  const center = getCenterPosition(tileCount)
  const newGameSnake = [{x: center.x, y: center.y}]
  const tempSnake = [{x: center.x, y: center.y}]
  
  let attempts = 0
  let newGameFood
  do {
    newGameFood = generateFoodPosition(tileCount)
    attempts++
  } while (tempSnake.some(seg => seg.x === newGameFood.x && seg.y === newGameFood.y) && attempts < 100)

  return {
    ...state,
    gameRunning: false,
    gameOverTime: Date.now(),
    waveStartTime: Date.now(),
    newGameSnake,
    newGameFood,
    newGameFoodSpawnTime: 0
  }
}

export function resetGame(state, tileCount) {
  const center = getCenterPosition(tileCount)
  
  const snake = state.newGameSnake || [{x: center.x, y: center.y}]
  const food = state.newGameFood || generateFood(snake, tileCount)
  
  const foodSpawnTime = state.newGameFoodSpawnTime > 0 
    ? state.newGameFoodSpawnTime 
    : Date.now()

  return {
    ...state,
    gameRunning: true,
    gameOverTime: 0,
    score: 0,
    gameSpeed: 600,
    manualControl: false,
    snake,
    food,
    dx: 1,
    dy: 0,
    headGlowStartTime: -1,
    previousHeadPos: {x: center.x, y: center.y},
    waveStartTime: 0,
    foodEatTime: 0,
    foodSpawnTime,
    newGameSnake: null,
    newGameFood: null,
    newGameFoodSpawnTime: 0,
    restartTimeout: null
  }
}

