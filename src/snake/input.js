import { MIN_SWIPE, KEY_MAP } from './constants.js'

export function createInputHandlers(getState, setters, canvas) {
  const { setDx, setDy, setManualControl, setIsManualMode } = setters

  function handleKeyPress(key) {
    const state = getState()
    if (!state.manualControl) return

    const dir = KEY_MAP[key]
    if (!dir) return

    if ((dir.x !== 0 && dir.x === dir.prevent * state.dx) || (dir.y !== 0 && dir.y === dir.prevent * state.dy)) {
      return
    }

    setDx(dir.x)
    setDy(dir.y)
  }

  function toggleManualControl() {
    const state = getState()
    const newManualControl = !state.manualControl
    setManualControl(newManualControl)
    setIsManualMode(newManualControl)
    if (newManualControl) {
      canvas.setAttribute('tabindex', '0')
      canvas.focus()
    } else {
      canvas.blur()
    }
  }

  // Touch handling state
  let touchStartX = 0
  let touchStartY = 0
  let isSwipe = false

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
      const state = getState()
      if (state.manualControl) {
        setManualControl(false)
        setIsManualMode(false)
        canvas.blur()
      }
    }
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    
    const state = getState()
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY

    if (Math.abs(deltaX) > MIN_SWIPE || Math.abs(deltaY) > MIN_SWIPE) {
      isSwipe = true
      if (!state.manualControl) {
        setManualControl(true)
        setIsManualMode(true)
        canvas.setAttribute('tabindex', '0')
        canvas.focus()
      }
    }

    if (!state.manualControl) return

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > MIN_SWIPE) {
        if (deltaX > 0 && state.dx !== -1) {
          setDx(1)
          setDy(0)
        } else if (deltaX < 0 && state.dx !== 1) {
          setDx(-1)
          setDy(0)
        }
        touchStartX = touch.clientX
      }
    } else {
      if (Math.abs(deltaY) > MIN_SWIPE) {
        if (deltaY > 0 && state.dy !== -1) {
          setDx(0)
          setDy(1)
        } else if (deltaY < 0 && state.dy !== 1) {
          setDx(0)
          setDy(-1)
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

  return {
    handleClick,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDocumentTouchStart
  }
}

