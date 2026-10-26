<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner'

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from '@lucide/vue'
import { Toaster as Sonner } from 'vue-sonner'

import { cn } from '~~/src/shared/lib/utils'

const props = defineProps<ToasterProps>()
</script>

<template>
  <!-- The registry exposes its theming as inline CSS variables, which the
       static-style rule cannot tell apart from a hardcoded style. -->
  <!-- eslint-disable vue/no-static-inline-styles -->
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
  <!-- eslint-enable vue/no-static-inline-styles -->
</template>
