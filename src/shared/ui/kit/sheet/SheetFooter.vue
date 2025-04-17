<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="cn('mt-auto flex flex-col gap-2 p-4', props.class)
    "
    data-slot="sheet-footer"
  >
    <slot />
  </div>
</template>
