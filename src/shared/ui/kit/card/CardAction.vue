<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', props.class)"
    data-slot="card-action"
  >
    <slot />
  </div>
</template>
