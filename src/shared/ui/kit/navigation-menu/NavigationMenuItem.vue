<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuItem, type NavigationMenuItemProps } from 'reka-ui'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<NavigationMenuItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <NavigationMenuItem
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
    data-slot="navigation-menu-item"
  >
    <slot />
  </NavigationMenuItem>
</template>
