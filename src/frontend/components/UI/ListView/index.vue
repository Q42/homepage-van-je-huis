<template>
  <SharedIconButton class="close-button" icon="close" @click="setView" />
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
import { DistanceViewAggregateEntry } from '../../../../common/apiSchema/present'

import { getTranslationKey } from '@/translations'
import { Entries, EntryWithImage, AggregateType } from '~/models/Entries'

export interface ListViewProps {
  entries: Entries
  setView: () => void
}

const props = defineProps<ListViewProps>()
</script>

<style lang="less" scoped>
.close-button {
  position: fixed;
  margin-top: 40px;
  margin-left: calc(50vw + (678px / 2 + 25px));
}

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
  width: 678px;
  max-width: 75%;
}

.card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
