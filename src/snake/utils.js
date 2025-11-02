import { GRID_SIZE } from './constants.js'

export function getCenterPosition(tileCount) {
  return {
    x: Math.floor(tileCount / 2),
    y: Math.floor(tileCount / 2)
  }
}

export function resizeCanvas(canvas) {
  const maxSize = 600
  const isMobile = window.innerWidth <= 768
  const isSmallMobile = window.innerWidth <= 480
  
  const padding = isMobile ? 20 : 40
  const headerHeight = isMobile ? 80 : 120
  
  const availableWidth = window.innerWidth - padding * 2
  const availableHeight = window.innerHeight - headerHeight
  
  let size = Math.min(availableWidth, availableHeight, maxSize)
  size = Math.floor(size / GRID_SIZE) * GRID_SIZE
  
  const minTiles = isSmallMobile ? 12 : 15
  size = Math.max(size, GRID_SIZE * minTiles)
  
  canvas.width = size
  canvas.height = size
  canvas.style.width = Math.min(size, window.innerWidth) + 'px'
  
  return size / GRID_SIZE
}

