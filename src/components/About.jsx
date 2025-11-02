import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'

function About() {
  const aboutRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (aboutRef.current) {
      ScrollReveal().reveal(aboutRef.current, {
        distance: '50px',
        duration: 3000,
        origin: 'bottom',
        easing: 'ease',
        interval: 100,
        reset: true
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Game constants
    const gridSize = 60
    const RESTART_DELAY = 2500
    const WAVE_FADE_DISTANCE = 2.5
    const WAVE_DURATION = 1000
    const MIN_SWIPE = 30
    const FOOD_SPAWN_DURATION = 400
    const FOOD_PULSE_DURATION = 1500
    const FOOD_GLOW_INTENSITY = 15
    const COLORS = {
      background: '#0b1c1e',
      // snake: '#66ff66',
      snake: '#bbf7d0',
      food: '#ff1744'
    }

    let tileCount

    // Helper functions
    function getCenterPosition() {
      return {
        x: Math.floor(tileCount / 2),
        y: Math.floor(tileCount / 2)
      }
    }

    function resizeCanvas() {
      const maxSize = 600
      const isMobile = window.innerWidth <= 768
      const isSmallMobile = window.innerWidth <= 480
      
      const padding = isMobile ? 20 : 40
      const headerHeight = isMobile ? 80 : 120
      
      const availableWidth = window.innerWidth - padding * 2
      const availableHeight = window.innerHeight - headerHeight
      
      let size = Math.min(availableWidth, availableHeight, maxSize)
      size = Math.floor(size / gridSize) * gridSize
      
      const minTiles = isSmallMobile ? 12 : 15
      size = Math.max(size, gridSize * minTiles)
      
      canvas.width = size
      canvas.height = size
      canvas.style.width = Math.min(size, window.innerWidth) + 'px'
      
      tileCount = size / gridSize
    }

    // Game state
    let snake = [{x: 10, y: 10}]
    let food = {}
    let dx = 0
    let dy = 0
    let score = 0
    let gameRunning = true
    let gameSpeed = 600
    let manualControl = false
    
    // Wave effect state
    let gameOverTime = 0
    let restartTimeout = null
    let waveStartTime = 0
    let newGameSnake = null
    let newGameFood = null
    
    // Glow effect state
    let headGlowStartTime = 0
    let previousHeadPos = null
    
    // Food spawn animation state
    let foodSpawnTime = 0
    let newGameFoodSpawnTime = 0

    function generateFoodPosition() {
      return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      }
    }

    function generateFood() {
      let attempts = 0
      do {
        food = generateFoodPosition()
        attempts++
      } while (willCollideWithSnake(food.x, food.y) && attempts < 100)
      foodSpawnTime = Date.now()
    }

    function isValidPosition(x, y) {
      return x >= 0 && x < tileCount && y >= 0 && y < tileCount
    }

    function willCollideWithSnake(x, y) {
      return snake.some(seg => seg.x === x && seg.y === y)
    }

    function findPathToFood() {
      const head = snake[0]
      const directions = [
        {x: 1, y: 0}, {x: -1, y: 0},
        {x: 0, y: 1}, {x: 0, y: -1}
      ]

      const validDirections = directions.filter(dir => {
        const nextX = head.x + dir.x
        const nextY = head.y + dir.y

        if (!isValidPosition(nextX, nextY)) return false
        if (willCollideWithSnake(nextX, nextY)) return false
        if ((dx !== 0 && dir.x === -dx) || (dy !== 0 && dir.y === -dy)) return false

        return true
      })

      if (validDirections.length === 0) {
        endGame()
        return
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

          if (!isValidPosition(futureX, futureY)) continue
          if (willCollideWithSnake(futureX, futureY)) {
            isSafe = false
            break
          }
        }

        if (isSafe || validDirections.length === 1) {
          dx = dir.x
          dy = dir.y
          return
        }
      }

      if (validDirections.length > 0) {
        dx = validDirections[0].x
        dy = validDirections[0].y
      }
    }

    function endGame() {
      if (!gameRunning) return

      gameRunning = false
      gameOverTime = Date.now()
      waveStartTime = Date.now()
      newGameFoodSpawnTime = 0

      const center = getCenterPosition()
      newGameSnake = [{x: center.x, y: center.y}]

      const tempSnake = [{x: center.x, y: center.y}]
      let attempts = 0
      do {
        newGameFood = generateFoodPosition()
        attempts++
      } while (tempSnake.some(seg => seg.x === newGameFood.x && seg.y === newGameFood.y) && attempts < 100)

      const totalWaveDuration = WAVE_DURATION * (1 + WAVE_FADE_DISTANCE / tileCount)
      restartTimeout = setTimeout(resetGame, totalWaveDuration)
    }

    function resetGame() {
      if (restartTimeout) {
        clearTimeout(restartTimeout)
        restartTimeout = null
      }

      gameRunning = true
      gameOverTime = 0
      score = 0
      gameSpeed = 600
      manualControl = false

      const center = getCenterPosition()

      if (newGameSnake) {
        snake = newGameSnake
        newGameSnake = null
      } else {
        snake = [{x: center.x, y: center.y}]
      }

      if (newGameFood) {
        food = newGameFood
        newGameFood = null
        foodSpawnTime = newGameFoodSpawnTime > 0 ? newGameFoodSpawnTime : Date.now()
        newGameFoodSpawnTime = 0
      } else {
        generateFood()
      }

      dx = 1
      dy = 0

      headGlowStartTime = -1
      previousHeadPos = previousHeadPos || {x: center.x, y: center.y}
      waveStartTime = 0
    }

    function moveSnake() {
      if (!gameRunning) return

      if (!manualControl) {
        findPathToFood()
      }

      const head = {x: snake[0].x + dx, y: snake[0].y + dy}

      if (!isValidPosition(head.x, head.y) || willCollideWithSnake(head.x, head.y)) {
        endGame()
        return
      }

      snake.unshift(head)

      if (previousHeadPos && (previousHeadPos.x !== head.x || previousHeadPos.y !== head.y)) {
        headGlowStartTime = 0
      }

      previousHeadPos = {x: head.x, y: head.y}

      if (head.x === food.x && head.y === food.y) {
        score++
        generateFood()
      } else {
        snake.pop()
      }
    }

    function getCellWaveOpacity(cellY) {
      if (waveStartTime === 0 || gameRunning) return 1

      const timeSinceWaveStart = Date.now() - waveStartTime
      const progress = Math.min(1 + WAVE_FADE_DISTANCE / tileCount, timeSinceWaveStart / WAVE_DURATION)
      const waveFrontRow = progress * tileCount
      const cellRow = cellY / gridSize
      const rowProgress = waveFrontRow - cellRow

      if (rowProgress <= 0) return 1
      if (rowProgress < 1) return Math.max(0, 1 - rowProgress)
      return 0
    }

    function drawSnakeSegment(x, y, waveOpacity, alpha = 1, shadowBlur = 10) {
      if (waveOpacity <= 0) return

      ctx.save()
      ctx.globalAlpha = alpha * waveOpacity
      ctx.shadowBlur = shadowBlur
      ctx.shadowColor = COLORS.snake
      ctx.strokeStyle = COLORS.snake
      ctx.lineWidth = 2

      const padding = 2
      ctx.strokeRect(x + padding, y + padding, gridSize - padding * 2, gridSize - padding * 2)
      ctx.restore()
    }

    function calculateFoodOpacity(spawnTime) {
      if (spawnTime <= 0) return 1
      const timeSinceSpawn = Date.now() - spawnTime
      return Math.min(1, timeSinceSpawn / FOOD_SPAWN_DURATION)
    }

    function calculateFoodGlow(foodOpacity) {
      if (foodOpacity >= 1) {
        const pulsePhase = (Date.now() % FOOD_PULSE_DURATION) / FOOD_PULSE_DURATION
        return (Math.sin(pulsePhase * Math.PI * 2) + 1) / 2
      }
      return foodOpacity * 0.5
    }

    function drawFood(x, y, waveOpacity, customSpawnTime = null) {
      if (waveOpacity <= 0) return

      const spawnTime = customSpawnTime ?? foodSpawnTime
      const foodOpacity = calculateFoodOpacity(spawnTime)
      const glowIntensity = calculateFoodGlow(foodOpacity)

      const rubySize = gridSize * 0.55
      ctx.save()
      ctx.globalAlpha = waveOpacity * foodOpacity
      
      if (glowIntensity > 0) {
        ctx.shadowBlur = FOOD_GLOW_INTENSITY * glowIntensity
        ctx.shadowColor = COLORS.food
      }
      
      ctx.strokeStyle = COLORS.food
      ctx.lineWidth = 3
      ctx.strokeRect(x - rubySize / 2, y - rubySize / 2, rubySize, rubySize)
      ctx.restore()
    }

    function draw() {
      ctx.fillStyle = COLORS.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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
          const x = segment.x * gridSize
          const y = segment.y * gridSize
          drawSnakeSegment(x, y, getCellWaveOpacity(y))
        }
      })
      ctx.restore()

      const head = snake[0]
      const headX = head.x * gridSize
      const headY = head.y * gridSize
      const headWaveOpacity = getCellWaveOpacity(headY)

      if (headWaveOpacity > 0) {
        const shadowBlur = glowIntensity > 0 ? 20 * glowIntensity : 0
        drawSnakeSegment(headX, headY, headWaveOpacity, opacity, shadowBlur)
      }

      if (snake.length > 1) {
        const tail = snake[snake.length - 1]
        const tailX = tail.x * gridSize
        const tailY = tail.y * gridSize
        const tailWaveOpacity = getCellWaveOpacity(tailY)

        if (tailWaveOpacity > 0) {
          ctx.save()
          ctx.globalAlpha = (1 - opacity * 0.4) * tailWaveOpacity
          ctx.shadowBlur = 10 * (1 - glowIntensity * 0.4)
          ctx.shadowColor = COLORS.snake
          ctx.strokeStyle = COLORS.snake
          ctx.lineWidth = 2
          const padding = 2
          ctx.strokeRect(tailX + padding, tailY + padding, gridSize - padding * 2, gridSize - padding * 2)
          ctx.restore()
        }
      }

      const foodX = food.x * gridSize + gridSize / 2
      const foodY = food.y * gridSize + gridSize / 2
      drawFood(foodX, foodY, getCellWaveOpacity(food.y * gridSize))
    }

    function gameLoop() {
      draw()
      if (!gameRunning) {
        drawWaveEffect()
        drawNewGameElements()
      }
    }

    function drawNewGameElements() {
      if (waveStartTime === 0 || !newGameSnake || !newGameFood) return

      const timeSinceWaveStart = Date.now() - waveStartTime
      const progress = Math.min(1 + WAVE_FADE_DISTANCE / tileCount, timeSinceWaveStart / WAVE_DURATION)
      const waveFrontRow = progress * tileCount
      const center = getCenterPosition()
      const startRowProgress = waveFrontRow - center.y

      if (newGameFood) {
        const foodRowProgress = waveFrontRow - newGameFood.y
        const maxProgress = Math.max(startRowProgress, foodRowProgress)

        if (maxProgress >= 1) {
          if (newGameFoodSpawnTime === 0) {
            newGameFoodSpawnTime = Date.now()
          }
          const foodX = newGameFood.x * gridSize + gridSize / 2
          const foodY = newGameFood.y * gridSize + gridSize / 2
          drawFood(foodX, foodY, 1, newGameFoodSpawnTime)
        }
      }

      if (startRowProgress > 0 && newGameSnake) {
        const fadeInProgress = Math.min(1, (startRowProgress - 1) / 2)
        if (fadeInProgress > 0) {
          const segment = newGameSnake[0]
          const x = segment.x * gridSize
          const y = segment.y * gridSize
          drawSnakeSegment(x, y, 1, fadeInProgress)
        }
      }
    }

    function drawWaveEffect() {
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
            const cellX = x * gridSize
            const cellY = y * gridSize

            ctx.save()
            ctx.globalAlpha = opacity

            if (glowIntensity > 0) {
              ctx.shadowBlur = 20 * glowIntensity
              ctx.shadowColor = COLORS.snake
            }

            const padding = 2
            ctx.strokeRect(cellX + padding, cellY + padding, gridSize - padding * 2, gridSize - padding * 2)
            ctx.restore()
          }
        }
      }

      ctx.restore()
    }

    function handleKeyPress(key) {
      if (!manualControl) return

      const keyMap = {
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

      const dir = keyMap[key]
      if (!dir) return

      if ((dir.x !== 0 && dir.x === dir.prevent * dx) || (dir.y !== 0 && dir.y === dir.prevent * dy)) {
        return
      }

      dx = dir.x
      dy = dir.y
    }

    function toggleManualControl() {
      manualControl = !manualControl
      if (manualControl) {
        canvas.setAttribute('tabindex', '0')
        canvas.focus()
      }
    }

    // Touch handling state
    let touchStartX = 0
    let touchStartY = 0
    let isSwipe = false
    let resizeTimeout

    // Event handlers
    const handleClick = () => toggleManualControl()
    
    const handleKeyDown = (e) => {
      e.preventDefault()
      handleKeyPress(e.key)
    }

    const handleTouchStart = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      isSwipe = false
    }

    const handleDocumentTouchStart = (e) => {
      if (!canvas.contains(e.target)) {
        manualControl = false
      }
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      
      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = touch.clientY - touchStartY

      if (Math.abs(deltaX) > MIN_SWIPE || Math.abs(deltaY) > MIN_SWIPE) {
        isSwipe = true
        if (!manualControl) {
          manualControl = true
        }
      }

      if (!manualControl) return

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > MIN_SWIPE) {
          if (deltaX > 0 && dx !== -1) {
            dx = 1
            dy = 0
          } else if (deltaX < 0 && dx !== 1) {
            dx = -1
            dy = 0
          }
          touchStartX = touch.clientX
        }
      } else {
        if (Math.abs(deltaY) > MIN_SWIPE) {
          if (deltaY > 0 && dy !== -1) {
            dx = 0
            dy = 1
          } else if (deltaY < 0 && dy !== 1) {
            dx = 0
            dy = -1
          }
          touchStartY = touch.clientY
        }
      }
    }

    const handleTouchEnd = (e) => {
      e.preventDefault()
      if (!isSwipe) {
        toggleManualControl()
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        resizeCanvas()
        const center = getCenterPosition()
        if (snake[0].x >= tileCount || snake[0].y >= tileCount) {
          snake = [{x: center.x, y: center.y}]
          generateFood()
        }
      }, 100)
    }

    // Initialize game
    resizeCanvas()
    const center = getCenterPosition()
    snake = [{x: center.x, y: center.y}]
    previousHeadPos = {x: center.x, y: center.y}
    generateFood()
    dx = 1
    dy = 0

    // Animation state
    let lastMoveTime = 0
    let lastFrameTime = 0
    let wasGameOver = false

    function startGame() {
      function animate(currentTime) {
        if (!gameRunning) {
          wasGameOver = true
          gameLoop()
          lastFrameTime = currentTime
        } else {
          if (wasGameOver) {
            lastMoveTime = currentTime
            lastFrameTime = currentTime
            wasGameOver = false
          }

          if (headGlowStartTime >= 0 && headGlowStartTime < gameSpeed) {
            const timeDelta = lastFrameTime > 0 ? currentTime - lastFrameTime : 16
            headGlowStartTime += timeDelta
          }

          draw()

          if (currentTime - lastMoveTime >= gameSpeed) {
            moveSnake()
            lastMoveTime = currentTime
          }

          lastFrameTime = currentTime
        }

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Event listeners
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchstart', handleDocumentTouchStart)
    window.addEventListener('resize', handleResize)

    // Start game
    startGame()

    // Cleanup
    return () => {
      if (restartTimeout) {
        clearTimeout(restartTimeout)
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchstart', handleDocumentTouchStart)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <section id="about" className="section reveal" ref={aboutRef}>
      <h2>About Me</h2>
      <p>
        I'm a backend developer with over 5 years of experience in Ruby on Rails, PostgreSQL, and scalable microservice architecture.
        I've worked on financial platforms, complex integrations, and performance optimization. Based in Tbilisi, open to remote or relocation.
      </p>
      <p style={{ marginTop: '2rem', marginBottom: '1rem', color: '#d1d5db' }}>
        Click on the game below to take manual control. Use arrow keys or WASD to control the snake.
        On mobile, swipe to control or tap to toggle manual mode.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <canvas 
          id="snake-canvas" 
          ref={canvasRef}
          style={{ 
            backgroundColor: '#0b1c1e',
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%',
            aspectRatio: '1 / 1',
            outline: 'none'
          }}
        />
      </div>
    </section>
  )
}

export default About
