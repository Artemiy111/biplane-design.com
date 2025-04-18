<script setup lang="ts">
import '~~/src/shared/assets/css/main.css'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

import { Toaster } from '~~/src/shared/ui/kit/sonner'
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

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
