<template>
  <div v-if="entries" class="entry-list">
    <SharedIconButton
      class="close-button"
      icon="close"
      @click="() => setView(getClosestElementToTop())"
    />
    <div
      v-for="(entry, index) in entries"
      :id="elementIds[index]"
      :key="index"
      class="entry-wrapper"
    >
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
import { Entries, EntryWithImage, AggregateType } from '@/models/Entries'

export interface ListViewProps {
  entries: Entries
  setView: (id: string) => void
}

const getClosestElementToTop = () => {
  const elements = document.getElementsByClassName('entry-wrapper')
  let closestElement = elements[0]
  let closestDistance = Math.abs(elements[0].getBoundingClientRect().top)

  for (let i = 1; i < elements.length; i++) {
    const distance = Math.abs(elements[i].getBoundingClientRect().top)

    if (distance < closestDistance && !(distance < 0)) {
      closestElement = elements[i]
      closestDistance = distance
    }
  }

  const index = Array.from(elements).indexOf(closestElement)

  return elements[index === 0 ? index : index - 1].id
}

const elementIds = computed(() => generateIds(props.entries))
const props = defineProps<ListViewProps>()
</script>

<style lang="less" scoped>
.close-button {
  position: fixed;
  top: 30px;
  right: 35px;

  @media @mq-from-desktop-md {
    top: 120px;
    right: unset;
    transform: translateX(calc(678px / 2 + 35px));
  }
}

.entry-wrapper {
  width: 100%;
}

.entry-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding-bottom: 1.5rem;
  position: relative;
  width: 678px;
  max-width: 75%;
  margin: 0 auto;
}

.card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
