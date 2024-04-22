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
  offsetX: number
  offsetY: number
}

type AnimationPosition = { start: StartPosition; end: EndPosition }
type FirstAnimationPosition = { start: FirstPosition; end: EndPosition }

export const AGGREGATE_CARD_SCALE = 3
export const SCROLL_TRIGGER_CONTAINER_HEIGHT = 900

// We want the first elements to have a different start position.
// The items you add here are not part of the normal animation flow.
const firstPosition: FirstAnimationPosition[] = [
  {
    start: { x: window.innerWidth * 0.6, y: 100, scale: 0.5 },
    end: { offsetX: 200, offsetY: -200 },
  },
  {
    start: {
      x: 250,
      y: window.innerHeight / 2 + 300,
      scale: 0.7,
    },
    end: { offsetX: -300, offsetY: 200 },
  },
]

// This are the animation positions of the elements after the first ones.
const animationPositions: AnimationPosition[] = [
  {
    // 1
    start: { pos: 'top', offsetInPercentage: -20 },
    end: { offsetX: -300, offsetY: -200 },
  },
  {
    // 2
    start: { pos: 'right', offsetInPercentage: 50 },
    end: { offsetX: 420, offsetY: 200 },
  },
  {
    // 3
    start: { pos: 'bottom', offsetInPercentage: 50 },
    end: { offsetX: 0, offsetY: 200 },
  },
  {
    // 4
    start: { pos: 'left', offsetInPercentage: 90 },
    end: { offsetX: -420, offsetY: 0 },
  },
  {
    // 5
    start: { pos: 'top', offsetInPercentage: 100 },
    end: { offsetX: 300, offsetY: -200 },
  },
]

const calculatePositionIndex = (index: number, isAggregateCard: boolean) => {
  const position = (index - firstPosition.length) % animationPositions.length

  const aggregateCardComesFromRight =
    isAggregateCard &&
    position ===
      animationPositions.findIndex((pos) => pos.start.pos === 'right')

  if (aggregateCardComesFromRight) {
    // Aggregate cards that come from the right don't work, so we place them at the left.
    return animationPositions.findIndex((pos) => pos.start.pos === 'left')
  } else {
    return position
  }
}

export const getAnimatedElementId = (index: number) => {
  return `animated-element-${index.toString()}`
}

export const getTransformFrom = (index: number) => {
  const element = document.getElementById(
    getAnimatedElementId(index),
  ) as HTMLElement
  if (!element) {
    return
  }

  const isAggregateCard = Boolean(element.querySelector('.aggregate-card'))

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight

  // Aggregate cards are scaled in animated view to make them accessible. That's why we need to calculate the offset.
  const offsetX = isAggregateCard
    ? (elementWidth * AGGREGATE_CARD_SCALE) / 2 - elementWidth / 2
    : 0
  const offsetY = isAggregateCard
    ? (elementHeight * AGGREGATE_CARD_SCALE) / 2 - elementHeight / 2
    : 0

  if (index <= firstPosition.length - 1) {
    const scale = firstPosition[index].start.scale
    const x = firstPosition[index].start.x - (elementWidth * scale) / 2
    const y = firstPosition[index].start.y - (elementHeight * scale) / 2

    return `translate(${x}px, ${y}px) scale(${scale})`
  }

  const input =
    animationPositions[calculatePositionIndex(index, isAggregateCard)].start

  let x = 0
  let y = 0

  if (input.pos === 'left' || input.pos === 'right') {
    input.pos === 'left'
      ? (x = -elementWidth - offsetX)
      : (x = windowWidth + offsetX)
    y = (windowHeight / 100) * input.offsetInPercentage - elementHeight / 2
  } else if (input.pos === 'top' || input.pos === 'bottom') {
    input.pos === 'top'
      ? (y = -elementHeight - offsetY)
      : (y = windowHeight + offsetY)
    x = (windowWidth / 100) * input.offsetInPercentage - elementWidth / 2
  }

  return `translate(${x}px, ${y}px)`
}

export const getTransformTo = (index: number) => {
  const isFirstPosition = index <= firstPosition.length - 1

  const element = document.getElementById(
    getAnimatedElementId(index),
  ) as HTMLElement

  const isAggregateCard = Boolean(element.querySelector('.aggregate-card'))

  const input = isFirstPosition
    ? firstPosition[index].end
    : animationPositions[calculatePositionIndex(index, isAggregateCard)].end

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight

  const translateValue = `translate(${windowWidth / 2 - elementWidth / 2 + input.offsetX}px, ${windowHeight / 2 - elementHeight / 2 + input.offsetY}px)`

  const scale = `scale(
   ${isFirstPosition ? firstPosition[index].start.scale : 1}
    )`

  return translateValue + ' ' + scale
}

const SCROLL_TRIGGER_OFFSET_PERCENTAGE = 30

export const getScrollTriggerTransform = (index: number) => {
  if (index <= firstPosition.length - 1) {
    const percentage = 100 * index
    return `translateY(-${percentage}%)`
  } else {
    const percentage =
      100 +
      (index - (firstPosition.length - 1)) * SCROLL_TRIGGER_OFFSET_PERCENTAGE
    return `translateY(-${percentage}%)`
  }
}

export const calculateScrollBoxHeight = (numberOfElements: number) => {
  const elementsAfterFirst = numberOfElements - firstPosition.length
  const heightFactor = (100 - SCROLL_TRIGGER_OFFSET_PERCENTAGE) / 100
  const actualTriggerHeight = SCROLL_TRIGGER_CONTAINER_HEIGHT * heightFactor

  return (
    SCROLL_TRIGGER_CONTAINER_HEIGHT +
    elementsAfterFirst * actualTriggerHeight +
    900 +
    'px'
  )
}
