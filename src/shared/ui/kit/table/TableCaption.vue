<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <caption
    :class="cn('text-muted-foreground mt-4 text-sm', props.class)"
    data-slot="table-caption"
  >
    <slot />
  </caption>
</template>
