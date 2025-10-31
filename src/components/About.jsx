import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'

function About() {
  const aboutRef = useRef(null)

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

  return (
    <section id="about" className="section reveal" ref={aboutRef}>
      <h2>About Me</h2>
      <p>
        I'm a backend developer with over 5 years of experience in Ruby on Rails, PostgreSQL, and scalable microservice architecture.
        I've worked on financial platforms, complex integrations, and performance optimization. Based in Tbilisi, open to remote or relocation.
      </p>
    </section>
  )
}

export default About
