import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../common/apiSchema/present'
import { TimelineEntry } from '../../common/apiSchema/past'

export type Entries =
  | (DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry)[]
  | undefined
