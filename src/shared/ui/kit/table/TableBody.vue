<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tbody
    :class="cn('[&_tr:last-child]:border-0', props.class)"
    data-slot="table-body"
  >
    <slot />
  </tbody>
</template>
