<script setup lang="ts">
import { GLTFModel, OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <div class="font-bold">
    <TresCanvas window-size clear-color="#fff">
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
  </div>
</template>
