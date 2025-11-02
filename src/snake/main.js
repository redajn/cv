import { COLORS } from './constants.js'
import { resizeCanvas, getCenterPosition } from './utils.js'
import { generateFood, moveSnake, endGame, resetGame } from './gameLogic.js'
import { draw } from './rendering.js'
import { createInputHandlers } from './input.js'

export function createSnakeGame(canvas, rubyMap, setIsManualMode) {
  const ctx = canvas.getContext('2d')
  let tileCount = resizeCanvas(canvas)
  
  // Game state
  let state = {
    snake: [{x: 10, y: 10}],
    food: {},
    dx: 0,
    dy: 0,
    score: 0,
    gameRunning: true,
    gameSpeed: 600,
    manualControl: false,
    gameOverTime: 0,
    restartTimeout: null,
    waveStartTime: 0,
    newGameSnake: null,
    newGameFood: null,
    newGameFoodSpawnTime: 0,
    headGlowStartTime: 0,
    previousHeadPos: null,
    foodSpawnTime: 0,
    foodEatTime: 0
  }

  // Initialize game
  const center = getCenterPosition(tileCount)
  state.snake = [{x: center.x, y: center.y}]
  state.previousHeadPos = {x: center.x, y: center.y}
  state.food = generateFood(state.snake, tileCount)
  state.foodSpawnTime = Date.now()
  state.dx = 1
  state.dy = 0

  // Getter for current state
  const getState = () => state

  // Setters for state updates
  const setters = {
    setDx: (value) => { state.dx = value },
    setDy: (value) => { state.dy = value },
    setManualControl: (value) => { state.manualControl = value },
    setIsManualMode: setIsManualMode
  }

  // Input handlers
  const inputHandlers = createInputHandlers(getState, setters, canvas)
  
  // Animation state
  let lastMoveTime = 0
  let lastFrameTime = 0
  let wasGameOver = false
  let animationFrameId = null
  let resizeTimeout = null

  function handleResize() {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      tileCount = resizeCanvas(canvas)
      const center = getCenterPosition(tileCount)
      if (state.snake[0].x >= tileCount || state.snake[0].y >= tileCount) {
        state.snake = [{x: center.x, y: center.y}]
        state.food = generateFood(state.snake, tileCount)
      }
    }, 100)
  }

  function animate(currentTime) {
    // Handle game over / restart
    if (!state.gameRunning) {
      wasGameOver = true
      draw(canvas, ctx, state, tileCount, rubyMap, 
        (y) => {
          if (state.waveStartTime === 0 || state.gameRunning) return 1
          const timeSinceWaveStart = Date.now() - state.waveStartTime
          const progress = Math.min(1 + 2.5 / tileCount, timeSinceWaveStart / 1000)
          const waveFrontRow = progress * tileCount
          const cellRow = y / 60
          const rowProgress = waveFrontRow - cellRow
          if (rowProgress <= 0) return 1
          if (rowProgress < 1) return Math.max(0, 1 - rowProgress)
          return 0
        },
        getCenterPosition
      )

      // Check if restart timeout elapsed
      if (state.restartTimeout !== null && state.gameOverTime > 0) {
        const timeSinceEnd = Date.now() - state.gameOverTime
        if (timeSinceEnd >= state.restartTimeout) {
          state = resetGame(state, tileCount)
          setIsManualMode(false)
          lastMoveTime = currentTime
          lastFrameTime = currentTime
          wasGameOver = false
        }
      }
      
      lastFrameTime = currentTime
      animationFrameId = requestAnimationFrame(animate)
      return
    }

    // Normal game loop
    if (wasGameOver) {
      lastMoveTime = currentTime
      lastFrameTime = currentTime
      wasGameOver = false
    }

    // Update head glow animation
    if (state.headGlowStartTime >= 0 && state.headGlowStartTime < state.gameSpeed) {
      const timeDelta = lastFrameTime > 0 ? currentTime - lastFrameTime : 16
      state.headGlowStartTime += timeDelta
    }

    // Generate new food after fade out animation
    if (state.foodEatTime > 0) {
      const timeSinceEat = Date.now() - state.foodEatTime
      if (timeSinceEat >= 200) {
        state.foodEatTime = 0
        state.food = generateFood(state.snake, tileCount)
        state.foodSpawnTime = Date.now()
      }
    }

    // Draw
    draw(canvas, ctx, state, tileCount, rubyMap,
      (y) => {
        if (state.waveStartTime === 0 || state.gameRunning) return 1
        const timeSinceWaveStart = Date.now() - state.waveStartTime
        const progress = Math.min(1 + 2.5 / tileCount, timeSinceWaveStart / 1000)
        const waveFrontRow = progress * tileCount
        const cellRow = y / 60
        const rowProgress = waveFrontRow - cellRow
        if (rowProgress <= 0) return 1
        if (rowProgress < 1) return Math.max(0, 1 - rowProgress)
        return 0
      },
      getCenterPosition
    )

    // Move snake
    if (currentTime - lastMoveTime >= state.gameSpeed) {
      const newState = moveSnake(state, tileCount)
      
      // Handle game over
      if (!newState.gameRunning && state.gameRunning) {
        state = endGame(state, tileCount)
        const WAVE_DURATION = 1000
        const WAVE_FADE_DISTANCE = 2.5
        const totalWaveDuration = WAVE_DURATION * (1 + WAVE_FADE_DISTANCE / tileCount)
        state.restartTimeout = totalWaveDuration
      } else {
        state = newState
      }

      lastMoveTime = currentTime
    }

    lastFrameTime = currentTime
    animationFrameId = requestAnimationFrame(animate)
  }

  // Start game
  animationFrameId = requestAnimationFrame(animate)

  // Event listeners
  canvas.addEventListener('click', inputHandlers.handleClick)
  canvas.addEventListener('keydown', inputHandlers.handleKeyDown)
  canvas.addEventListener('touchstart', inputHandlers.handleTouchStart)
  canvas.addEventListener('touchmove', inputHandlers.handleTouchMove)
  canvas.addEventListener('touchend', inputHandlers.handleTouchEnd)
  document.addEventListener('touchstart', inputHandlers.handleDocumentTouchStart)
  window.addEventListener('resize', handleResize)

  // Return cleanup function
  return () => {
    if (state.restartTimeout !== null) {
      clearTimeout(state.restartTimeout)
    }
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    canvas.removeEventListener('click', inputHandlers.handleClick)
    canvas.removeEventListener('keydown', inputHandlers.handleKeyDown)
    canvas.removeEventListener('touchstart', inputHandlers.handleTouchStart)
    canvas.removeEventListener('touchmove', inputHandlers.handleTouchMove)
    canvas.removeEventListener('touchend', inputHandlers.handleTouchEnd)
    document.removeEventListener('touchstart', inputHandlers.handleDocumentTouchStart)
    window.removeEventListener('resize', handleResize)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}

