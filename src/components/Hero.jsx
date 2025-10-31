import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'

function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    if (heroRef.current) {
      ScrollReveal().reveal(heroRef.current, {
        distance: '50px',
        duration: 3000,
        origin: 'bottom',
        easing: 'ease',
        reset: true
      })
    }
  }, [])

  return (
    <section id="hero" className="section-hero reveal" ref={heroRef}>
      <h1>Ruby Backend Developer</h1>
      <p>
        I design and build backend systems with Ruby, PostgreSQL, Docker, and more. Available for remote work or relocation.
      </p>
    </section>
  )
}

export default Hero
