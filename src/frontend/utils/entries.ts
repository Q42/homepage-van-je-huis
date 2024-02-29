import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../common/apiSchema/present'
import { TimelineEntry } from '../../common/apiSchema/past'

let lastId: number | null = null

export const getId = (
  entry: TimelineEntry | DistanceViewAggregateEntry | DistanceViewEntry,
) => {
  if (entry.position === lastId) {
    return undefined
  } else {
    lastId = entry.position
    return lastId?.toString()
  }
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
