<script setup lang="ts">
import type { SelectLabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { SelectLabel } from 'reka-ui'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectLabel
    :class="cn('text-muted-foreground px-2 py-1.5 text-xs', props.class)"
    data-slot="select-label"
  >
    <slot />
  </SelectLabel>
</template>
