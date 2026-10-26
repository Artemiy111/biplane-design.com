<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { ErrorMessage } from 'vee-validate'
import { toValue } from 'vue'

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
    :class="cn('text-destructive text-sm', props.class)"
    data-slot="form-message"
    :name="toValue(name)"
  />
</template>
