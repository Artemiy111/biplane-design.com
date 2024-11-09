<script setup lang="ts">
import { useGroupsModel } from '~~/src/shared/model/groups'
import { useUserModel } from '~~/src/shared/model/user'
import { Footer } from '~~/src/widgets/footer'
import { Header } from '~~/src/widgets/header'

const userModel = useUserModel()
const groupsModel = useGroupsModel()
// useLazyAsyncData('groups', () => groupsModel.load())
useQuery({ key: ['user'], query: () => userModel.load() })
useQuery({ key: ['groups'], query: () => groupsModel.load() })
// onMounted(() => refresh())
</script>

<template>
  <div class="text-base font-normal md:text-sm">
    <div class="flex h-full min-h-[100dvh] w-full flex-col">
      <Header />
      <NuxtPage />
    </div>
    <Footer />
  </div>
</template>
