import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../common/apiSchema/present'
import { TimelineEntry } from '../../common/apiSchema/past'

export type Entries =
  | (DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry)[]
  | undefined

export type EntryWithImage = DistanceViewEntry | TimelineEntry
export type AggregateType =
  | 'aggregate_trees'
  | 'aggregate_tree_species'
  | 'aggregate_bees'
