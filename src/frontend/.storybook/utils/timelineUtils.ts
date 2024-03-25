import uniq from 'lodash/uniq'
import { PastData } from '../../common/apiSchema/past'
import { PresentData } from '../../common/apiSchema/present'

export const getEntryPositions = (
  entries: PastData['timeline'] | PresentData['slider'],
) => {
  return uniq(entries.map((entry) => entry.position))
}

export const getPercentageInRange = (
  rangeMax: number,
  rangeMin: number,
  value: number,
) => {
  const result = ((value - rangeMin) / (rangeMax - rangeMin)) * 100

  if (result > 100) {
    return 100
  } else if (result < 0) {
    return 0
  } else {
    return result
  }
}
