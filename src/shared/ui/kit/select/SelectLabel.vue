<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { SelectLabel, type SelectLabelProps } from 'reka-ui'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectLabel
    :class="cn('px-2 py-1.5 text-sm font-medium', props.class)"
    data-slot="select-label"
  >
    <slot />
  </SelectLabel>
</template>
