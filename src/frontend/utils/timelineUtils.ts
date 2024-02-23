import uniq from 'lodash/uniq'
import { PastData } from '../../common/apiSchema/past'
import { PresentData } from '../../common/apiSchema/present'

export const getEntryPositions = (
  entries: PastData['timeline'] | PresentData['slider'],
) => {
  return uniq(entries.map((entry) => entry.position))
}
