import { GRID_SIZE, COLORS, FOOD_SPAWN_DURATION, FOOD_PULSE_DURATION, FOOD_GLOW_INTENSITY, FOOD_EAT_DURATION, WAVE_FADE_DISTANCE, WAVE_DURATION } from './constants.js'

export function getCellWaveOpacity(cellY, waveStartTime, gameRunning, tileCount) {
  if (waveStartTime === 0 || gameRunning) return 1

  const timeSinceWaveStart = Date.now() - waveStartTime
  const progress = Math.min(1 + WAVE_FADE_DISTANCE / tileCount, timeSinceWaveStart / WAVE_DURATION)
  const waveFrontRow = progress * tileCount
  const cellRow = cellY / GRID_SIZE
  const rowProgress = waveFrontRow - cellRow

  if (rowProgress <= 0) return 1
  if (rowProgress < 1) return Math.max(0, 1 - rowProgress)
  return 0
}

export function calculateFoodOpacity(spawnTime) {
  if (spawnTime <= 0) return 1
  const timeSinceSpawn = Date.now() - spawnTime
  return Math.min(1, timeSinceSpawn / FOOD_SPAWN_DURATION)
}

export function calculateFoodEatOpacity(eatTime) {
  if (eatTime <= 0) return 1
  const timeSinceEat = Date.now() - eatTime
  return Math.max(0, 1 - timeSinceEat / FOOD_EAT_DURATION)
}

export function calculateFoodGlow(foodOpacity) {
  if (foodOpacity >= 1) {
    const pulsePhase = (Date.now() % FOOD_PULSE_DURATION) / FOOD_PULSE_DURATION
    return (Math.sin(pulsePhase * Math.PI * 2) + 1) / 2
  }
  return foodOpacity * 0.5
}

export function drawSnakeSegment(ctx, x, y, waveOpacity, alpha = 1, shadowBlur = 10) {
  if (waveOpacity <= 0) return

  ctx.save()
  ctx.globalAlpha = alpha * waveOpacity
  ctx.shadowBlur = shadowBlur
  ctx.shadowColor = COLORS.snake
  ctx.strokeStyle = COLORS.snake
  ctx.lineWidth = 2

  const padding = 2
  ctx.strokeRect(x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
  ctx.restore()
}

export function drawFood(ctx, x, y, waveOpacity, foodSpawnTime, foodEatTime, rubyMap) {
  if (waveOpacity <= 0) return

  const spawnOpacity = calculateFoodOpacity(foodSpawnTime)
  const eatOpacity = calculateFoodEatOpacity(foodEatTime)
  const foodOpacity = Math.min(spawnOpacity, eatOpacity)
  
  if (foodOpacity <= 0) return
  
  const glowIntensity = calculateFoodGlow(foodOpacity)

  const rubySize = GRID_SIZE * 0.9
  const scale = rubySize / 50
  
  ctx.save()
  ctx.globalAlpha = waveOpacity * foodOpacity
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  
  if (glowIntensity > 0) {
    ctx.shadowBlur = FOOD_GLOW_INTENSITY * glowIntensity / scale
    ctx.shadowColor = COLORS.food
  }
  
  ctx.strokeStyle = COLORS.food
  ctx.lineWidth = 2 / scale
  
  ctx.beginPath()
  for (let i = 0; i < rubyMap.length; i++) {
    const line = rubyMap[i]
    const data = line.data.map(n => n - 25)
    
    switch (line.method) {
      case 'move_to':
        ctx.moveTo(...data)
        break
      case 'line_to':
        ctx.lineTo(...data)
        break
    }
  }
  ctx.stroke()
  ctx.restore()
}

export function drawSnake(ctx, snake, headGlowStartTime, gameSpeed, previousHeadPos, getCellWaveOpacity) {
  let opacity = 1
  let glowIntensity = 0

  if (headGlowStartTime >= 0) {
    const progress = Math.min(1, headGlowStartTime / gameSpeed)
    opacity = progress
    glowIntensity = 1 - Math.pow(1 - progress, 2)
  }

  ctx.save()
  snake.forEach((segment, index) => {
    if (index !== 0 && index !== snake.length - 1) {
      const x = segment.x * GRID_SIZE
      const y = segment.y * GRID_SIZE
      drawSnakeSegment(ctx, x, y, getCellWaveOpacity(y))
    }
  })
  ctx.restore()

  const head = snake[0]
  const headX = head.x * GRID_SIZE
  const headY = head.y * GRID_SIZE
  const headWaveOpacity = getCellWaveOpacity(headY)

  if (headWaveOpacity > 0) {
    const shadowBlur = glowIntensity > 0 ? 20 * glowIntensity : 0
    drawSnakeSegment(ctx, headX, headY, headWaveOpacity, opacity, shadowBlur)
  }

  if (snake.length > 1) {
    const tail = snake[snake.length - 1]
    const tailX = tail.x * GRID_SIZE
    const tailY = tail.y * GRID_SIZE
    const tailWaveOpacity = getCellWaveOpacity(tailY)

    if (tailWaveOpacity > 0) {
      ctx.save()
      ctx.globalAlpha = (1 - opacity * 0.4) * tailWaveOpacity
      ctx.shadowBlur = 10 * (1 - glowIntensity * 0.4)
      ctx.shadowColor = COLORS.snake
      ctx.strokeStyle = COLORS.snake
      ctx.lineWidth = 2
      const padding = 2
      ctx.strokeRect(tailX + padding, tailY + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
      ctx.restore()
    }
  }
}

export function drawWaveEffect(ctx, waveStartTime, tileCount) {
  const timeSinceWaveStart = Date.now() - waveStartTime
  const progress = Math.min(1 + WAVE_FADE_DISTANCE / tileCount, timeSinceWaveStart / WAVE_DURATION)
  const waveFrontRow = progress * tileCount

  ctx.save()
  ctx.strokeStyle = COLORS.snake
  ctx.lineWidth = 2

  for (let y = 0; y < tileCount; y++) {
    const rowProgress = waveFrontRow - y
    let opacity = 0
    let glowIntensity = 0

    if (rowProgress > 0) {
      if (rowProgress < 1) {
        opacity = rowProgress
        glowIntensity = 1
      } else if (rowProgress < WAVE_FADE_DISTANCE + 1) {
        const fadeProgress = (rowProgress - 1) / WAVE_FADE_DISTANCE
        opacity = Math.max(0, 1 - fadeProgress)
        glowIntensity = Math.max(0, 1 - fadeProgress)
      }
    }

    if (opacity > 0 || glowIntensity > 0) {
      for (let x = 0; x < tileCount; x++) {
        const cellX = x * GRID_SIZE
        const cellY = y * GRID_SIZE

        ctx.save()
        ctx.globalAlpha = opacity

        if (glowIntensity > 0) {
          ctx.shadowBlur = 20 * glowIntensity
          ctx.shadowColor = COLORS.snake
        }

        const padding = 2
        ctx.strokeRect(cellX + padding, cellY + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
        ctx.restore()
      }
    }
  }

  ctx.restore()
}

export function drawNewGameElements(ctx, waveStartTime, newGameSnake, newGameFood, newGameFoodSpawnTime, tileCount, rubyMap, getCenterPosition) {
  if (waveStartTime === 0 || !newGameSnake || !newGameFood) return

  const timeSinceWaveStart = Date.now() - waveStartTime
  const progress = Math.min(1 + WAVE_FADE_DISTANCE / tileCount, timeSinceWaveStart / WAVE_DURATION)
  const waveFrontRow = progress * tileCount
  const center = getCenterPosition(tileCount)
  const startRowProgress = waveFrontRow - center.y

  if (newGameFood) {
    const foodRowProgress = waveFrontRow - newGameFood.y
    const maxProgress = Math.max(startRowProgress, foodRowProgress)

    if (maxProgress >= 1) {
      const foodX = newGameFood.x * GRID_SIZE + GRID_SIZE / 2
      const foodY = newGameFood.y * GRID_SIZE + GRID_SIZE / 2
      const spawnTime = newGameFoodSpawnTime || Date.now()
      drawFood(ctx, foodX, foodY, 1, spawnTime, 0, rubyMap)
    }
  }

  if (startRowProgress > 0 && newGameSnake) {
    const fadeInProgress = Math.min(1, (startRowProgress - 1) / 2)
    if (fadeInProgress > 0) {
      const segment = newGameSnake[0]
      const x = segment.x * GRID_SIZE
      const y = segment.y * GRID_SIZE
      drawSnakeSegment(ctx, x, y, 1, fadeInProgress)
    }
  }
}

export function draw(canvas, ctx, state, tileCount, rubyMap, getCellWaveOpacity, getCenterPosition) {
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const getWaveOpacity = (y) => getCellWaveOpacity(y, state.waveStartTime, state.gameRunning, tileCount)

  drawSnake(ctx, state.snake, state.headGlowStartTime, state.gameSpeed, state.previousHeadPos, getWaveOpacity)

  // Draw food
  if (state.foodEatTime > 0) {
    const timeSinceEat = Date.now() - state.foodEatTime
    if (timeSinceEat >= FOOD_EAT_DURATION) {
      // Food will be regenerated in game loop
    } else {
      const foodX = state.food.x * GRID_SIZE + GRID_SIZE / 2
      const foodY = state.food.y * GRID_SIZE + GRID_SIZE / 2
      drawFood(ctx, foodX, foodY, getWaveOpacity(state.food.y * GRID_SIZE), state.foodSpawnTime, state.foodEatTime, rubyMap)
    }
  } else {
    const foodX = state.food.x * GRID_SIZE + GRID_SIZE / 2
    const foodY = state.food.y * GRID_SIZE + GRID_SIZE / 2
    drawFood(ctx, foodX, foodY, getWaveOpacity(state.food.y * GRID_SIZE), state.foodSpawnTime, state.foodEatTime, rubyMap)
  }

  if (!state.gameRunning) {
    drawWaveEffect(ctx, state.waveStartTime, tileCount)
    drawNewGameElements(ctx, state.waveStartTime, state.newGameSnake, state.newGameFood, state.newGameFoodSpawnTime, tileCount, rubyMap, getCenterPosition)
  }
}

