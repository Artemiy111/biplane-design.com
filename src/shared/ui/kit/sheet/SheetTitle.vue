<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogTitle
    :class="cn('text-foreground font-semibold', props.class)"
    data-slot="sheet-title"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>
