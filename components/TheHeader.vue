<script setup lang="ts">
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'
</script>

<template>
  <header class="container flex-col flex z-50">
    <div class="items-center flex px-8 py-4 justify-between z-50">
      <NuxtLink to="/" class="flex gap-4 items-center">
        <img src="/logo.svg" class="h-10">
        <span>Biplane-Design</span>
      </NuxtLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NuxtLink
              to="/projects"
              :class="navigationMenuTriggerStyle()"
              class="cursor-pointer"
            >
              Проекты
            </NuxtLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NuxtLink
              to="/about"
              :class="navigationMenuTriggerStyle()"
              class="cursor-pointer"
            >
              О нас
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    <Separator class="z-50" />
  </header>
</template>
