<template>
  <div class="calendar-item-card">
    <!-- <SharedImage v-if="calendarItem.image" :image="calendarItem.image" /> -->
    <SharedImage
      class="image"
      :image="{
        url: imageUrl,
      }"
    />
    <div class="calendar-item-card__content">
      <SharedTypography variant="h5">{{
        calendarItem.Name_event
      }}</SharedTypography>
      <SharedTypography class="text-with-icon" variant="body" :compact="true">
        <span class="icon">
          <SharedIcon :height="16" :width="16" type="calendar" />
        </span>
        {{ fromDate }} {{ isOneDayEvent ? '' : ` - ${toDate}` }}
      </SharedTypography>
      <SharedTypography
        v-if="calendarItem.Location"
        class="text-with-icon"
        variant="body"
        :compact="true"
      >
        <span class="icon">
          <SharedIcon :height="16" :width="16" type="location" />
        </span>
        {{ calendarItem.Location }}
      </SharedTypography>
    </div>
    <SharedTypography
      v-if="calendarItem.Description"
      variant="body"
      :compact="true"
    >
      {{ calendarItem.Description }}
    </SharedTypography>
    <SharedLink
      :href="calendarItem.Link"
      :label="$t(getTranslationKey('calendarItem.goToLink'))"
    />
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { getTranslationKey } from '@/translations'

type TemporaryCalenderItem = {
  Event_ID: string
  Name_event: string
  Date_start: string
  Date_end: string
  Location: string
  Description: string
  Link: string
}

export interface CalendarItemProps {
  calendarItem: TemporaryCalenderItem
  imageUrl: string // TODO: remove, this is only mock data
}

const fromDate = computed(() =>
  format(parseISO(props.calendarItem.Date_start as string), 'dd MMMM yyyy', {
    locale: nl,
  }),
)

const toDate = computed(() =>
  format(parseISO(props.calendarItem.Date_end as string), 'dd MMMM yyyy', {
    locale: nl,
  }),
)

const isOneDayEvent = computed(() => fromDate.value === toDate.value)

const props = defineProps<CalendarItemProps>()
</script>

<style lang="less" scoped>
.calendar-item-card {
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.icon {
  display: inline-flex;
  align-items: center;
  height: 100%;
  transform: translateY(-1px); // The icon looks to far down otherwise
}
.text-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image {
  aspect-ratio: 3 / 2;
}
</style>
