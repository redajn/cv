import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'
import { rubyMap } from '../logofall/shapes/ruby.js'
import { createSnakeGame } from '../snake/main.js'

function About() {
  const aboutRef = useRef(null)
  const canvasRef = useRef(null)
  const [isManualMode, setIsManualMode] = React.useState(false)

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

    const cleanup = createSnakeGame(canvas, rubyMap, setIsManualMode)
    return cleanup
  }, [])

  return (
    <section id="about" className="section reveal" ref={aboutRef}>
      <h2>About Me</h2>
      <p>
        I'm a backend developer with over 5 years of experience in Ruby on Rails, PostgreSQL, and scalable microservice architecture.
        I've worked on financial platforms, complex integrations, and performance optimization. Based in Tbilisi, open to remote or relocation.
      </p>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '1.5rem',
          position: 'relative',
          zIndex: isManualMode ? 120 : 'auto'
        }}
      >
        <canvas 
          id="snake-canvas" 
          ref={canvasRef}
          className={isManualMode ? 'snake-canvas-focused' : ''}
          style={{ 
            backgroundColor: '#0b1c1e',
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%',
            aspectRatio: '1 / 1',
            outline: 'none',
            position: 'relative',
            zIndex: isManualMode ? 121 : 'auto',
            transition: 'box-shadow 0.8s ease-out'
          }}
        />
      </div>
    </section>
  )
}

export default About
