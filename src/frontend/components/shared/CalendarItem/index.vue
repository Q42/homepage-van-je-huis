<template>
  <div class="calendar-item-card">
    <SharedImage v-if="calendarItem.image" :image="calendarItem.image" />
    <div class="calendar-item-card__content">
      <SharedTypography variant="h5">{{ calendarItem.title }}</SharedTypography>
      <SharedTypography variant="body" :compact="true">
        <span class="icon">
          <SharedIcon :height="16" :width="16" type="calendar" />{{ date }}
        </span>
      </SharedTypography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { AgendaItem } from '../../../../common/apiSchema/present'

interface CalendarItem extends Omit<AgendaItem, 'date'> {
  date: string
}

export interface CalendarItemProps {
  calendarItem: CalendarItem
}

const date = computed(() =>
  format(parseISO(props.calendarItem.date), 'dd MMMM yyyy', { locale: nl }),
)

const props = defineProps<CalendarItemProps>()
</script>

<style lang="less" scoped>
.icon {
  margin-right: 5px;
}
</style>
