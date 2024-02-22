<script setup>
import { ErrorMessage, Field, Form } from 'vee-validate'

function isRequired(value) {
  if (value && value.trim())
    return true

  return 'This is required'
}
</script>

<template>
  <Form>
    <FormField name="field" type="text" :rules="isRequired" />
    <ErrorMessage name="field" />
  </Form>
</template>
