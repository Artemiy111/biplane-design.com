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
  <!-- The `for` is bound to the field id and is not a static attribute. -->
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
  <Label
    :class="cn(
      'data-[error=true]:text-destructive',
      props.class,
    )"
    :data-error="!!error"
    data-slot="form-label"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
