import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'
import { mapRegistry } from '../logofall/shapes/index.js'
import { Actor } from '../logofall/models/Actor.js'
import { checkCollisions } from '../logofall/utils/checkCollisions.js'
import { groundMap } from '../logofall/shapes/immovable/ground.js'
import { wallMap } from '../logofall/shapes/immovable/wall.js'
import { LEVEL, ACTOR, CANVAS } from '../logofall/constants.js'

function Skills() {
  const skillsRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const objectsRef = useRef([])
  const levelObjectsRef = useRef([])
  const allObjectsRef = useRef([]) // Pre-allocated array for collision checking

  useEffect(() => {
    if (skillsRef.current) {
      ScrollReveal().reveal(skillsRef.current, {
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
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context')
        return
      }

    function resizeCanvasToDisplaySize(canvas) {
      const rect = canvas.getBoundingClientRect()
      const scale = CANVAS.SCALE
      const width = Math.floor(rect.width * scale)
      const height = Math.floor(rect.height * scale)

      // Only resize if dimensions actually changed
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true
      }
      return false
    }

    function spawnActorOnHover(spanId, map) {
      const span = document.getElementById(spanId)
      if (!span) return

      const handleMouseEnter = () => {
        const spawnMargin = ACTOR.SPAWN_X_MARGIN * 2
        const x = Math.random() * (canvas.width - spawnMargin) + ACTOR.SPAWN_X_MARGIN
        objectsRef.current.push(
          new Actor(
            x, 
            ACTOR.SPAWN_Y_OFFSET, 
            map, 
            { type: 'circle', radius: ACTOR.SPAWN_RADIUS }, 
            ACTOR.DEFAULT_COLOR
          )
        )
      }

      span.addEventListener('mouseenter', handleMouseEnter)
      
      return () => {
        span.removeEventListener('mouseenter', handleMouseEnter)
      }
    }

    // Initialize canvas size
    resizeCanvasToDisplaySize(canvas)

    // Initialize level objects (will be updated in animate if canvas size changes)
    if (canvas.width > 0 && canvas.height > 0) {
      levelObjectsRef.current = [
        new Actor(
          canvas.width / 2,
          canvas.height,
          groundMap,
          { type: 'rect', width: LEVEL.GROUND_WIDTH, height: LEVEL.GROUND_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        ),
        new Actor(
          0,
          canvas.height / 2,
          wallMap,
          { type: 'rect', width: LEVEL.WALL_WIDTH, height: LEVEL.WALL_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        ),
        new Actor(
          canvas.width,
          canvas.height / 2,
          wallMap,
          { type: 'rect', width: LEVEL.WALL_WIDTH, height: LEVEL.WALL_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        )
      ]
    } else {
      // Initialize with default positions, will be corrected when canvas is resized
      levelObjectsRef.current = [
        new Actor(
          350,
          400,
          groundMap,
          { type: 'rect', width: LEVEL.GROUND_WIDTH, height: LEVEL.GROUND_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        ),
        new Actor(
          0,
          250,
          wallMap,
          { type: 'rect', width: LEVEL.WALL_WIDTH, height: LEVEL.WALL_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        ),
        new Actor(
          700,
          250,
          wallMap,
          { type: 'rect', width: LEVEL.WALL_WIDTH, height: LEVEL.WALL_HEIGHT },
          ACTOR.DEFAULT_COLOR,
          false
        )
      ]
    }

    // Setup hover listeners
    const cleanupFunctions = []
    for (const [key] of Object.entries(mapRegistry)) {
      const cleanup = spawnActorOnHover(`${key}-span`, mapRegistry[key])
      if (cleanup) {
        cleanupFunctions.push(cleanup)
      }
    }

    // Animation loop
    let lastTime = performance.now()
    let isTabVisible = true
    
    // Handle tab visibility
    const handleVisibilityChange = () => {
      const wasVisible = isTabVisible
      isTabVisible = !document.hidden
      // Reset time when tab becomes visible again to prevent huge deltaTime
      if (!wasVisible && isTabVisible) {
        lastTime = performance.now()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function animate() {
      const currentTime = performance.now()
      let deltaTime = currentTime - lastTime
      
      // Limit deltaTime to prevent huge jumps when tab becomes active
      // Max 200ms (equivalent to ~5fps minimum)
      const MAX_DELTA_TIME = 200
      if (deltaTime > MAX_DELTA_TIME) {
        deltaTime = MAX_DELTA_TIME
      }
      
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Handle canvas resize (only check once per frame, not every resize event)
      if (resizeCanvasToDisplaySize(canvas)) {
        // Update level objects positions on resize
        if (levelObjectsRef.current.length > 0) {
          levelObjectsRef.current[0].body.pos.x = canvas.width / 2
          levelObjectsRef.current[0].body.pos.y = canvas.height
          levelObjectsRef.current[1].body.pos.y = canvas.height / 2
          levelObjectsRef.current[2].body.pos.x = canvas.width
          levelObjectsRef.current[2].body.pos.y = canvas.height / 2
        }
      }

      // Optimize collision checking by reusing array instead of creating new one each frame
      allObjectsRef.current.length = 0
      allObjectsRef.current.push(...objectsRef.current, ...levelObjectsRef.current)
      checkCollisions(allObjectsRef.current)

      // Update and draw movable objects
      for (let i = objectsRef.current.length - 1; i >= 0; i--) {
        if (
          objectsRef.current[i].pos.y > canvas.height + objectsRef.current[i].radius ||
          objectsRef.current[i].pos.x < -objectsRef.current[i].radius ||
          objectsRef.current[i].pos.x > canvas.width + objectsRef.current[i].radius
        ) {
          objectsRef.current.splice(i, 1)
          continue
        }
        objectsRef.current[i].update(canvas.height, deltaTime)
        objectsRef.current[i].draw(ctx)
      }

      // Draw level objects
      for (let i = 0; i < levelObjectsRef.current.length; i++) {
        levelObjectsRef.current[i].draw(ctx)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Handle window resize
    const handleResize = () => {
      resizeCanvasToDisplaySize(canvas)
    }
    window.addEventListener('resize', handleResize)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cleanupFunctions.forEach(cleanup => cleanup())
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    } catch (error) {
      console.error('Error in Skills animation setup:', error)
    }
  }, [])

  const skills = [
    { id: 'ruby', name: 'Ruby' },
    { id: 'rails', name: 'Rails' },
    { id: 'pg', name: 'PostgreSQL' },
    { id: 'redis', name: 'Redis' },
    { id: 'sidekiq', name: 'Sidekiq' },
    { id: 'kafka', name: 'Kafka' },
    { id: 'docker', name: 'Docker' },
    { id: 'gitlab', name: 'GitLab CI/CD' },
    { id: 'sentry', name: 'Sentry' },
    { id: 'rspec', name: 'RSpec' },
    { id: 'rest', name: 'REST APIs' },
    { id: 'microservices', name: 'Microservices' }
  ]

  return (
    <section id="skills" className="section reveal" ref={skillsRef}>
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map(skill => (
          <span 
            key={skill.id}
            className="skill-item" 
            id={`${skill.id}-span`}
          >
            {skill.name}
          </span>
        ))}
      </div>
      <canvas 
        id="skill-canvas" 
        ref={canvasRef}
        style={{ backgroundColor: '#0b1c1e' }}
      />
    </section>
  )
}

export default Skills
