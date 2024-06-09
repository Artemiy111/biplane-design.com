<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { gsap } from 'gsap'
import SplitType from 'split-type'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

useSeoMeta({
  title: 'Biplane-Design',
  ogTitle: 'Biplane-Design',
  description: 'Студия дизайна',
  ogDescription: 'Студия дизайна',
})

const { height } = useWindowSize()
const { height: headerHeight } = useHeaderSize()
const mainScreenHeight = computed(() => height.value - headerHeight.value)

const headingRef = ref<HTMLHeadingElement | null>(null)
onMounted(() => {
  if (!headingRef.value) return
  const headingText = new SplitType(headingRef.value, { types: 'words' })
  gsap.from(headingText.words, { y: 80, duration: 0.8, opacity: 0, stagger: 0.2 })
  const descriptionText = new SplitType('.gsap-description', { types: 'words' })
  gsap.from(descriptionText.words, { y: 20, opacity: 0, duration: 0.2, stagger: 0.1 })
})
</script>

<template>
  <main class="container relative justify-center flex flex-col flex-grow h-full">
    <!-- <NuxtImg
      class="-z-10 absolute w-full top-[60px] right-[200px] max-w-[700px]"
      src="/plane.png"
      alt="plane"
    /> -->
    <NuxtImg
      src="/main.jpg"
      :style="{ height: `${mainScreenHeight}px` }"
      class="w-full object-cover"
    />
    <section class="absolute mx-4 flex gap-4 flex-col flex-grow pb-[200px]">
      <h1
        ref="headingRef"
        class="text-[150px] xl:text-[120px] lg:text-[100px] md:text-[80px] sm:text-[60px] font-bold leading-none text-yellow-400"
      >
        Biplane<br>Design
      </h1>
      <span
        class="gsap-description font-medium pl-2 leading-[130%] md:text-xl sm:text-lg xs:text-base text-white text-3xl"
      ><span>Первоклассные решения</span>&nbsp;<span class="whitespace-nowrap">в архитектуре и дизайне</span>
      </span>
      <NuxtLink
        to="/projects"
        :class="cn(buttonVariants({ variant: 'outline' }), 'w-fit ml-2')"
      >
        Смотреть проекты</NuxtLink>
    </section>
  </main>
</template>
