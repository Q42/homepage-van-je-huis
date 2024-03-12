<template>
  <div class="aggregate-card">
    <SharedIcon :height="95" :width="95" :type="iconType" />
    <div class="content">
      <SharedTypography variant="h5">{{
        $t(titleKey, { total: count })
      }}</SharedTypography>
      <!-- TODO: there is no visit url in the data -->
      <!-- <SharedLink
        :href="visitUrl"
        :label="$t(linkLabelKey)"
        :hide-icon="true"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTranslationKey } from '@/translations'

export interface AggregateCardProps {
  type: 'aggregate_trees' | 'aggregate_tree_species' | 'aggregate_bees'
  count: number
}

const iconType = computed(() => {
  switch (props.type) {
    case 'aggregate_trees':
      return 'trees'
    case 'aggregate_tree_species':
      return 'tree-species'
    case 'aggregate_bees':
      return 'bees'
  }
})

const titleKey = computed(() => {
  switch (props.type) {
    case 'aggregate_trees':
      return getTranslationKey('aggregateCard.treeTotal')
    case 'aggregate_tree_species':
      return getTranslationKey('aggregateCard.treeSpecies')
    case 'aggregate_bees':
      return getTranslationKey('aggregateCard.beeTotal')
  }
})

// const linkLabelKey = computed(() => {
//   if (props.type === 'aggregate_tree_species') {
//     return getTranslationKey('aggregateCard.seeWhichTreeSpecies')
//   }

//   return getTranslationKey('aggregateCard.seeWhere')
// })

const props = defineProps<AggregateCardProps>()
</script>

<style lang="less" scoped>
.aggregate-card {
  border: solid 3px @primary-blue;
  color: @primary-blue;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px;
  width: fit-content;
  background: @primary-white;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 240px;
}
</style>
