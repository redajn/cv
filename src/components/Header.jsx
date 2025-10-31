import React, { useState, useEffect } from 'react'

function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsMenuVisible(false)
      } else {
        setIsMenuVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = () => {
    setIsHoveringMenu(true)
    setIsMenuVisible(true)
  }

  const handleMouseLeave = () => {
    setIsHoveringMenu(false)
    if (window.scrollY > 200) {
      setIsMenuVisible(false)
    }
  }

  return (
    <header>
      <div className="logo">Andrew Ognev</div>
      <div 
        id="menu-area"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <nav 
        id="main" 
        className={isMenuVisible ? 'visible' : 'hidden'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href="#about">about</a>
        <a href="#skills">skills</a>
        <a href="#contact">contact</a>
      </nav>
    </header>
  )
}

export default Header
