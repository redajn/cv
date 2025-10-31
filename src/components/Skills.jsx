import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'
import * as shapes from '../logofall/shapes/index.js'
import { Actor } from '../logofall/models/Actor.js'
import { checkCollisions } from '../logofall/utils/checkCollisions.js'
import { groundMap } from '../logofall/shapes/immovable/ground.js'
import { wallMap } from '../logofall/shapes/immovable/wall.js'

function Skills() {
  const skillsRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const objectsRef = useRef([])
  const levelObjectsRef = useRef([])

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
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const mapRegistry = {
      docker: shapes.dockerMap,
      gitlab: shapes.gitlabMap,
      kafka: shapes.kafkaMap,
      microservices: shapes.microservicesMap,
      pg: shapes.pgMap,
      rails: shapes.railsMap,
      redis: shapes.redisMap,
      rest: shapes.restMap,
      rspec: shapes.rspecMap,
      ruby: shapes.rubyMap,
      sentry: shapes.sentryMap,
      sidekiq: shapes.sidekiqMap
    }

    function resizeCanvasToDisplaySize(canvas) {
      const rect = canvas.getBoundingClientRect()
      const scale = 1
      const width = Math.floor(rect.width * scale)
      const height = Math.floor(rect.height * scale)

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
        const x = Math.random() * (canvas.width - 50) + 25
        objectsRef.current.push(
          new Actor(x, -100, map, { type: 'circle', radius: 25 }, '#bbf7d0')
        )
      }

      span.addEventListener('mouseenter', handleMouseEnter)
      
      return () => {
        span.removeEventListener('mouseenter', handleMouseEnter)
      }
    }

    // Initialize canvas size
    resizeCanvasToDisplaySize(canvas)

    // Initialize level objects
    levelObjectsRef.current = [
      new Actor(
        canvas.width / 2,
        canvas.height,
        groundMap,
        { type: 'rect', width: 700, height: 2 },
        '#bbf7d0',
        false
      ),
      new Actor(
        0,
        canvas.height / 2,
        wallMap,
        { type: 'rect', width: 2, height: 500 },
        '#bbf7d0',
        false
      ),
      new Actor(
        canvas.width,
        canvas.height / 2,
        wallMap,
        { type: 'rect', width: 2, height: 500 },
        '#bbf7d0',
        false
      )
    ]

    // Setup hover listeners
    const cleanupFunctions = []
    for (const [key] of Object.entries(mapRegistry)) {
      const cleanup = spawnActorOnHover(`${key}-span`, mapRegistry[key])
      if (cleanup) {
        cleanupFunctions.push(cleanup)
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Handle canvas resize
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

      checkCollisions([...objectsRef.current, ...levelObjectsRef.current])

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
        objectsRef.current[i].update(canvas.height)
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
      cleanupFunctions.forEach(cleanup => cleanup())
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
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
