<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    :class="cn('text-muted-foreground ml-auto text-xs tracking-widest', props.class)"
    data-slot="dropdown-menu-shortcut"
  >
    <slot />
  </span>
</template>
