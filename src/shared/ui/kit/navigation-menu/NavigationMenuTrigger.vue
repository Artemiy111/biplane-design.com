<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  NavigationMenuTrigger,
  useForwardProps,
  type NavigationMenuTriggerProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

import { navigationMenuTriggerStyle } from '.'

const props = defineProps<NavigationMenuTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <NavigationMenuTrigger
    v-bind="forwardedProps"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class)"
    data-slot="navigation-menu-trigger"
  >
    <slot />
    <ChevronDown
      aria-hidden="true"
      class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
    />
  </NavigationMenuTrigger>
</template>
