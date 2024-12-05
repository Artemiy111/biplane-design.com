<script setup lang="ts">
import { DialogTitle, useForwardProps, type DialogTitleProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle
    v-bind="forwardedProps"
    :class="
      cn(
        'text-subheading',
        props.class,
      )
    "
  >
    <slot />
  </DialogTitle>
</template>
