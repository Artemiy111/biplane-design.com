<script setup lang="ts">
import { HoverCardRoot, useForwardPropsEmits } from 'radix-vue'
import type { HoverCardRootEmits, HoverCardRootProps } from 'radix-vue'

const props = defineProps<HoverCardRootProps>()
const emits = defineEmits<HoverCardRootEmits>()
const forwardedProps = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot v-bind="forwardedProps">
    <slot />
  </HoverCardRoot>
</template>
