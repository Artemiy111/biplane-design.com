<script setup lang="ts">
import { GLTFModel, OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <main class="container font-bold h-full">
    <TresCanvas clear-color="#fff" class="w-full h-full" preset="realistic" window-size height="500" width="500">
      <OrbitControls />
      <!-- <TresMesh>
        <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh> -->

      <Suspense>
        <GLTFModel path="/3d/biplane-medium.glb" />
      </Suspense>
      <TresDirectionalLight
        :intensity="2"
        :position="[3, 3, 3]"
      />
    </TresCanvas>
  </main>
</template>
