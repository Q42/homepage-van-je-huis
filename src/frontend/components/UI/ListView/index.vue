<template>
  <div v-if="entries" class="entry-list">
    <div v-for="(entry, index) in entries" :key="index">
      <div v-if="entryIsAggregate(entry)" class="entry-wrapper">
        <SharedAggregateCard
          :type="entry.type as AggregateType"
          :count="getAggregateCount(entry as DistanceViewAggregateEntry)"
        />
      </div>
      <div v-else class="entry-wrapper">
        <SharedImage
          v-if="(entry as EntryWithImage).image"
          :image="(entry as EntryWithImage).image!"
        />
        <div class="entry-info">
          <SharedTypography variant="body" :compact="true"
            >{{ entry.title }}
            <SharedLink
              v-if="(entry as EntryWithImage).visitUrl"
              :href="(entry as EntryWithImage).visitUrl!"
              :label="$t(getTranslationKey('images.externalLink'))"
            />
          </SharedTypography>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../../../common/apiSchema/present'
import { TimelineEntry } from '../../../../common/apiSchema/past'

import { getTranslationKey } from '@/translations'

type EntryWithImage = DistanceViewEntry | TimelineEntry
type AggregateType =
  | 'aggregate_trees'
  | 'aggregate_tree_species'
  | 'aggregate_bees'

export interface ListViewProps {
  entries:
    | (DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry)[]
    | undefined
}

const props = defineProps<ListViewProps>()

const entryIsAggregate = (
  entry: DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry,
) => {
  return (
    entry.type === 'aggregate_trees' ||
    entry.type === 'aggregate_tree_species' ||
    entry.type === 'aggregate_bees'
  )
}

const getAggregateCount = (entry: DistanceViewAggregateEntry) => {
  return entry.data[Object.keys(entry.data)[0]]
}
</script>

<style lang="less" scoped>
.entry-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding-bottom: 1.5rem;
}

.entry-wrapper {
  width: 615px;
  max-width: 75%;
}
</style>
