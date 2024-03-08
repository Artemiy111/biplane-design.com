<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
</script>

<template>
  <main class="py8 container flex flex-col px-8 sm:px-4">
    <h1>Аккаунт</h1>
  </main>
</template>
