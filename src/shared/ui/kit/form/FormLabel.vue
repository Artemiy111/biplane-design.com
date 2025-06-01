<script lang="ts" setup>
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'
import { Label } from '~~/src/shared/ui/kit/label'

import { useFormField } from './useFormField'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const { error, formItemId } = useFormField()
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/label-has-for -->
  <Label
    :class="cn(
      'data-[error=true]:text-destructive-foreground',
      props.class,
    )"
    :data-error="!!error"
    data-slot="form-label"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
