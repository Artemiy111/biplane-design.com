<script setup lang="ts">
import { cn } from '~~/src/shared/lib/utils'

export type HeadingTab = {
  title: string
  value: string
}
const props = withDefaults(defineProps<{
  tabs: HeadingTab[]
  tag?: 'h1' | 'h2'
}>(), {
  tag: 'h1',
})

const tabModel = defineModel<string>('tab', { required: true })
</script>

<template>
  <section class="mt-8 flex gap-x-8 text-heading">
    <component
    v-for="tab in props.tabs"
    :is="tab.value === tabModel ? props.tag : 'span'"
      :key="tab.value"
      :class="cn(
        'cursor-pointer text-heading text-gray-400 transition-colors',
        tab.value === tabModel ? 'text-foreground' : 'hover:text-gray-500',
      )"
      role="button"
      tabindex="0"
      @click="tabModel = tab.value"
      @keypress.enter.space="tabModel = tab.value"
    >
      {{ tab.title }}
    </component>
  </section>
</template>
