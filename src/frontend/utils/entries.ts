import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../common/apiSchema/present'
import { TimelineEntry } from '../../common/apiSchema/past'
import { Entries } from '@/models/Entries'

export const generateIds = (entries: Entries) => {
  let lastId: number | null = null
  let lastSuffix: number | null = null

  return (
    entries?.map((entry) => {
      if (entry.position === lastId) {
        lastSuffix = lastSuffix ? lastSuffix + 1 : 1
        return entry.position + '-' + lastSuffix
      } else {
        lastId = entry.position
        lastSuffix = null
        return lastId?.toString()
      }
    }) || []
  )
}

export const entryIsAggregate = (
  entry: DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry,
) => {
  return (
    entry.type === 'aggregate_trees' ||
    entry.type === 'aggregate_tree_species' ||
    entry.type === 'aggregate_bees'
  )
}
