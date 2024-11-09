<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

import { useGroupsModel } from '~~/src/shared/model/groups'
import { useUserModel } from '~~/src/shared/model/user'
import { Toaster } from '~~/src/shared/ui/kit/sonner'
// import { Footer } from '~~/src/widgets/footer'
// import { Header } from '~~/src/widgets/header'

const groupsModel = useGroupsModel()
const userModel = useUserModel()
// console.log('wft')
// useLazyAsyncData('groups', () => groupsModel.load())
// await useAsyncData('user', () => userModel.load())
const router = useRouter()

const yandexMetrika = import.meta.dev
  ? {}
  : {
      script: [
        {
          key: 'ym',
          innerHTML: `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(61819282, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true
        });
      `,
        },
      ],
      noscript: [{
        key: 'ym-no',
        innerHTML: `<div><img src="https://mc.yandex.ru/watch/61819282" style="position:absolute; left:-9999px;" alt="" /></div>`,
      }],
    }

useHead(yandexMetrika)
</script>

<template>
  <SpeedInsights />
  <Toaster :rich-colors="true" />
  <!-- <div class="text-base font-normal md:text-sm">
    <div class="flex h-full min-h-[100dvh] w-full flex-col">
      <Header />
      <NuxtPage />
    </div>
    <Footer />
  </div> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
