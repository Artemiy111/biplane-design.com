<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { SelectScrollDownButton, useForwardProps, type SelectScrollDownButtonProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectScrollDownButton
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
    data-slot="select-scroll-down-button"
  >
    <slot>
      <ChevronDown class="size-4" />
    </slot>
  </SelectScrollDownButton>
</template>
