<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    class="relative w-full overflow-auto"
    data-slot="table-container"
  >
    <table
      :class="cn('w-full caption-bottom text-sm', props.class)"
      data-slot="table"
    >
      <slot />
    </table>
  </div>
</template>
