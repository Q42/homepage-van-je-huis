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
      <SharedTypography variant="h5">{{ calendarItem.title }}</SharedTypography>
      <SharedTypography class="text-with-icon" variant="body" :compact="true">
        <span class="icon">
          <SharedIcon :height="16" :width="16" type="calendar" />
        </span>
        {{ date }}
      </SharedTypography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { AgendaItem } from '../../../../common/apiSchema/present'

interface CalendarItem extends Omit<AgendaItem, 'date'> {
  // TODO: fix this. date is alsways a string on FE
  date: string | Date
}

export interface CalendarItemProps {
  calendarItem: CalendarItem
  imageUrl: string // TODO: remove, this is only mock data
}

const date = computed(() =>
  format(parseISO(props.calendarItem.date as string), 'dd MMMM yyyy', {
    locale: nl,
  }),
)

const props = defineProps<CalendarItemProps>()
</script>

<style lang="less" scoped>
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
