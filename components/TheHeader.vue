<script setup lang="ts">
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'

const { md } = useScreenSize()

const route = useRoute()

const routes = [{
  link: '/projects',
  title: 'Проекты',
}, {
  link: '/about',
  title: 'О нас',
}]
</script>

<template>
  <header class="container flex-col flex z-50">
    <div class="items-center flex px-8 py-4 justify-between z-50">
      <NuxtLink to="/" class="flex gap-4 items-center">
        <img src="/logo.svg" class="h-10 md:h-8">
        <span class="sm:hidden">Biplane-Design</span>
      </NuxtLink>
      <NavigationMenu>
        <NavigationMenuList class="gap-4 sm:gap-2">
          <NavigationMenuItem v-for="r in routes" :key="r.link">
            <NuxtLink
              :to="r.link"
              class="cursor-pointer"
              :class="[navigationMenuTriggerStyle(),
                       md ? `${navigationMenuTriggerStyle({ size: 'sm' })}` : '',
                       r.link === route.path ? 'bg-primary-foreground' : '']"
            >
              {{ r.title }}
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    <Separator class="z-50" />
  </header>
</template>
