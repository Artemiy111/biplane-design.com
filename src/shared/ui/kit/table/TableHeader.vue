<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <thead
    :class="cn('[&_tr]:border-b', props.class)"
    data-slot="table-header"
  >
    <slot />
  </thead>
</template>
