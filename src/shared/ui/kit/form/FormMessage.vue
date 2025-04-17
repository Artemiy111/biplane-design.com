<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate'
import { toValue, type HTMLAttributes } from 'vue'

import { cn } from '~~/src/shared/lib/utils'

import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { name, formMessageId } = useFormField()
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    as="p"
    :class="cn('text-destructive-foreground text-sm', props.class)"
    data-slot="form-message"
    :name="toValue(name)"
  />
</template>
