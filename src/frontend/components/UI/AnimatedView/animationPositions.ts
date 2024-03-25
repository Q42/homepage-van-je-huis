type Position = { pos: 'left' | 'right' | 'top' | 'bottom'; offset: number }

type AnimationPosition = { start: Position; end: Position }

const animationPositions: AnimationPosition[] = [
  { start: { pos: 'left', offset: 10 }, end: { pos: 'left', offset: 0 } },
]

const calculatePositionIndex = (index: number) => {
  return index % animationPositions.length
}

export const getAnimatedElementId = (index: number) => {
  return `animated-element-${index.toString()}`
}

export const getTranslateFromPosition = (index: number) => {
  const input = animationPositions[calculatePositionIndex(index)].start
  const element = document.getElementById(
    getAnimatedElementId(index),
  ) as HTMLElement

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight

  let x = 0
  let y = 0

  if (input.pos === 'left' || input.pos === 'right') {
    input.pos === 'left'
      ? (x = -elementWidth)
      : (x = windowWidth + elementWidth)
    y = (windowHeight / 100) * input.offset
  } else if (input.pos === 'top' || input.pos === 'bottom') {
    input.pos === 'top'
      ? (y = -elementHeight)
      : (y = windowHeight + elementHeight)
    x = (windowWidth / 100) * input.offset
  }

  return `translate(${x}px, ${y}px)`
}

export const getTranslateToPosition = (index: number) => {
  const input = animationPositions[calculatePositionIndex(index)].end
  const element = document.getElementById(
    getAnimatedElementId(index),
  ) as HTMLElement

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight

  let x = 0
  let y = 0

  if (input.pos === 'left' || input.pos === 'right') {
    input.pos === 'left' ? (x = -input.offset) : (x = input.offset)
    y = (windowHeight / 100) * input.offset
  } else if (input.pos === 'top' || input.pos === 'bottom') {
    input.pos === 'top' ? (y = -input.offset) : (y = input.offset)
  }

  return `translate(${windowWidth / 2 - elementWidth / 2 + x}px, ${windowHeight / 2 - elementHeight / 2 + y}px)`
}
