type FirstPosition = {
  x: number
  y: number
  scale: number
}

type StartPosition = {
  pos: 'left' | 'right' | 'top' | 'bottom'
  offsetInPercentage: number
}
type EndPosition = {
  pos: 'left' | 'right' | 'top' | 'bottom'
  offsetInPx: number
}

type AnimationPosition = { start: StartPosition; end: EndPosition }
type FirstAnimationPosition = { start: FirstPosition; end: EndPosition }

export const aggregateCardScale = 3

// We want the first elements to have a different start position.
// The items you add here are not part of the normal animation flow.
const firstPosition: FirstAnimationPosition[] = [
  {
    start: { x: 100, y: 100, scale: 0.5 },
    end: { pos: 'top', offsetInPx: 100 },
  },
  {
    start: { x: -100, y: 700, scale: 0.8 },
    end: { pos: 'left', offsetInPx: 200 },
  },
]

// This are the animation positions of the elements after the first ones.
const animationPositions: AnimationPosition[] = [
  {
    // 1
    start: { pos: 'top', offsetInPercentage: 50 },
    end: { pos: 'top', offsetInPx: 100 },
  },
  {
    // 2
    start: { pos: 'right', offsetInPercentage: 50 },
    end: { pos: 'right', offsetInPx: 300 },
  },
  {
    // 3
    start: { pos: 'bottom', offsetInPercentage: 50 },
    end: { pos: 'bottom', offsetInPx: 100 },
  },
  {
    // 4
    start: { pos: 'left', offsetInPercentage: 50 },
    end: { pos: 'left', offsetInPx: 100 },
  },
]

const calculatePositionIndex = (index: number) => {
  return (index - firstPosition.length) % animationPositions.length
}

export const getAnimatedElementId = (index: number) => {
  return `animated-element-${index.toString()}`
}

export const getTransformFrom = (index: number) => {
  const element = document.getElementById(
    getAnimatedElementId(index),
  ) as HTMLElement

  const isAggregateCard = Boolean(element.querySelector('.aggregate-card'))

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = element.offsetWidth
  const elementHeight = isAggregateCard
    ? element.offsetHeight * ((aggregateCardScale / 3) * 2)
    : element.offsetHeight

  if (index <= firstPosition.length - 1) {
    const scale = firstPosition[index].start.scale
    const x = firstPosition[index].start.x - (elementWidth * scale) / 2
    const y = firstPosition[index].start.y - (elementHeight * scale) / 2

    return `translate(${x}px, ${y}px) scale(${scale})`
  }

  const input = animationPositions[calculatePositionIndex(index)].start

  let x = 0
  let y = 0

  if (input.pos === 'left' || input.pos === 'right') {
    input.pos === 'left'
      ? (x = -elementWidth)
      : (x = windowWidth + (isAggregateCard ? elementWidth : 0))
    y = (windowHeight / 100) * input.offsetInPercentage - elementHeight / 2
  } else if (input.pos === 'top' || input.pos === 'bottom') {
    input.pos === 'top'
      ? (y = -elementHeight)
      : (y = windowHeight + (isAggregateCard ? elementHeight : 0))
    x = (windowWidth / 100) * input.offsetInPercentage - elementWidth / 2
  }

  return `translate(${x}px, ${y}px)`
}

export const getTransformTo = (index: number) => {
  const isFirstPosition = index <= firstPosition.length - 1

  const input = isFirstPosition
    ? firstPosition[index].end
    : animationPositions[calculatePositionIndex(index)].end
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
    input.pos === 'left' ? (x = -input.offsetInPx) : (x = input.offsetInPx)
  } else if (input.pos === 'top' || input.pos === 'bottom') {
    input.pos === 'top' ? (y = -input.offsetInPx) : (y = input.offsetInPx)
  }

  const translateValue = `translate(${windowWidth / 2 - elementWidth / 2 + x}px, ${windowHeight / 2 - elementHeight / 2 + y}px)`

  const scale = `scale(
   ${isFirstPosition ? firstPosition[index].start.scale : 1}
    )`

  return translateValue + ' ' + scale
}
