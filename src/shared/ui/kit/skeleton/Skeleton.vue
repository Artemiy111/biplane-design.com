<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

type SkeletonProps = {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div
    :class="cn('animate-pulse rounded-md bg-primary/10', props.class)"
    data-slot="skeleton"
  />
</template>
