import React, { useEffect, useRef } from 'react'
import ScrollReveal from 'scrollreveal'

function Contact() {
  const contactRef = useRef(null)

  useEffect(() => {
    if (contactRef.current) {
      ScrollReveal().reveal(contactRef.current, {
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
    <section id="contact" className="section reveal" ref={contactRef}>
      <h2 className="text-3xl font-bold mb-6">Contact</h2>
      <p className="text-gray-300 mb-8">
        I'm currently open to opportunities and collaboration. Feel free to reach out through any of the following:
      </p>
      <ul className="space-y-4 text-lg">
        <li>
          <a 
            href="mailto:dev.ognev@gmail.com" 
            className="text-green-200 hover:underline hover:text-green-400 transion duration-300"
          >
            dev.ognev@gmail.com
          </a>
        </li>
        <li>
          <a 
            href="https://github.com/redajn" 
            className="text-green-200 hover:underline hover:text-green-400 duration-300" 
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
        <li>
          <a 
            href="https://www.linkedin.com/in/andrey-ognev/" 
            className="text-green-200 hover:underline hover:text-green-400 duration-300" 
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a 
            href="https://t.me/Sapiol" 
            className="text-green-200 hover:underline hover:text-green-400 duration-300" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
        </li>
      </ul>
    </section>
  )
}

export default Contact
