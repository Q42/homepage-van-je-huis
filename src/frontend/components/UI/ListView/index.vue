<template>
  <div v-if="entries" class="entry-list">
    <SharedIconButton
      v-if="!isOnDesktopLg"
      class="close-button"
      icon="close"
      @click="
        () => {
          // Prevents that the views scrolls to top offset
          mountedStore.animatedViewHasBeenMounted = true
          setView(getClosestElementToTop())
        }
      "
    />
    <div
      v-for="(entry, index) in entries"
      :id="elementIds[index]"
      :key="index"
      class="entry-wrapper"
    >
      <div class="card-wrapper">
        <SharedAggregateCard
          v-if="entryIsAggregate(entry) && isOnDesktopLg"
          :type="entry.type as AggregateType"
          class="aggregate-card"
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
import { Entries, AggregateType, EntryWithImage } from '@/models/Entries'
import { useMountStore } from '@/store/mountStore'

const mountedStore = useMountStore()

export interface ListViewProps {
  entries: Entries
  setView: (id: string) => void
}

const innerWidth = useScreenWidth()
const isOnDesktopLg = computed(() => isDesktopLg(innerWidth.value))

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
  z-index: 1;

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

.aggregate-card {
  max-width: 100%;
  padding: 20px 5px;
}
</style>
