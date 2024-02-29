<template>
  <div v-if="entries" class="entry-list">
    <div
      v-for="(entry, index) in entries"
      :id="getId(entry)"
      :key="index"
      class="entry-wrapper"
    >
      <div class="card-wrapper">
        <SharedAggregateCard
          v-if="entryIsAggregate(entry)"
          :type="entry.type as AggregateType"
          :count="(entry as DistanceViewAggregateEntry).data.count"
        />
      </div>
      <SharedImage
        v-if="!entryIsAggregate(entry) && (entry as EntryWithImage).image"
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
</template>

<script setup lang="ts">
import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../../../common/apiSchema/present'
import { TimelineEntry } from '../../../../common/apiSchema/past'

import { getTranslationKey } from '@/translations'
import { Entries, EntryWithImage, AggregateType } from '~/models/Entries'

export interface ListViewProps {
  entries: Entries
}

const props = defineProps<ListViewProps>()

let lastId: number | null = null

const getId = (
  entry: TimelineEntry | DistanceViewAggregateEntry | DistanceViewEntry,
) => {
  if (entry.position === lastId) {
    return undefined
  } else {
    lastId = entry.position
    return lastId.toString()
  }
}

const entryIsAggregate = (
  entry: DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry,
) => {
  return (
    entry.type === 'aggregate_trees' ||
    entry.type === 'aggregate_tree_species' ||
    entry.type === 'aggregate_bees'
  )
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

.card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
