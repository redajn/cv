import React, { useState, useEffect, useRef } from 'react'

function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prevMobileRef = useRef(false)

  useEffect(() => {
    const checkMobile = () => {
      const nowMobile = window.innerWidth <= 768
      const wasMobile = prevMobileRef.current
      
      // Close mobile menu when switching to desktop
      if (wasMobile && !nowMobile) {
        setIsMobileMenuOpen(false)
      }
      
      prevMobileRef.current = nowMobile
      setIsMobile(nowMobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      if (isHoveringMenu) {
        return
      }
      
      if (window.scrollY > 200) {
        setIsMenuVisible(false)
      } else {
        setIsMenuVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, isHoveringMenu])

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHoveringMenu(true)
      setIsMenuVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHoveringMenu(false)
      if (window.scrollY > 200) {
        setIsMenuVisible(false)
      }
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, isMobile])

  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileMenu()
    }
  }

  const handleNavClick = (e) => {
    if (isMobile && e.target.tagName !== 'a') {
      closeMobileMenu()
    }
  }

  return (
    <>
      <header>
        <div className="logo">Andrew Ognev</div>
        
        {/* Desktop menu area for hover detection */}
        {!isMobile && (
          <div 
            id="menu-area"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}

        {/* Desktop navigation */}
        {!isMobile && (
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
        )}
      </header>

      {/* Mobile hamburger button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={isMobileMenuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      {/* Mobile navigation */}
      {isMobile && (
        <>
          <div 
            className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={closeMobileMenu}
          />
          <nav 
            className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={handleNavClick}
          >
            <a href="#about" onClick={handleLinkClick}>about</a>
            <a href="#skills" onClick={handleLinkClick}>skills</a>
            <a href="#contact" onClick={handleLinkClick}>contact</a>
          </nav>
        </>
      )}
    </>
  )
}

export default Header
