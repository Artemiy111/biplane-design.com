<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tfoot
    :class="cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', props.class)"
    data-slot="table-footer"
  >
    <slot />
  </tfoot>
</template>
