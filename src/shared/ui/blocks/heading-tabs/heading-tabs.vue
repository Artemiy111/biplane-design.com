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

const tab = defineModel<string>('tab', { required: true })
</script>

<template>
  <section class="mt-8 flex gap-x-8 text-heading">
    <component
      :is="t.value === tab? props.tag : 'span'"
      v-for="t in props.tabs"
      :key="t.value"
      :class="cn(
        'cursor-pointer transition-colors text-foreground text-heading text-gray-400',
        t.value === tab ? 'text-foreground' : 'hover:text-gray-500',
      )"
      role="button"
      tabindex="0"
      @click="tab = t.value"
      @keypress.enter.space="tab = t.value"
    >
      {{ t.title }}
    </component>
  </section>
</template>
