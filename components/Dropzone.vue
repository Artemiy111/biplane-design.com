<script setup lang="ts">
import { FolderUp } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import type { Image } from '~/server/db/schema'

const props = defineProps<{
  multiple?: boolean
  showFiles?: boolean
  showIcon?: boolean
  class?: HTMLAttributes['class']
  images?: Image[]
}>()

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const inputRef = ref<InstanceType<typeof Input> | null>(null)
const files = ref<File[]>([])
const isDragging = ref(false)

function onDragover(_e: DragEvent) {
  isDragging.value = true
}

function onDragleave(_e: DragEvent) {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  if (!inputRef.value?.input)
    return
  inputRef.value.input.files = e.dataTransfer?.files || null
  onChange()
  isDragging.value = false
}

function onChange() {
  const inputFiles = [...inputRef.value?.input?.files || []]
  const oldFiles = new Set(files.value)

  const newFiles = inputFiles.filter(file => !oldFiles.has(file))
  if (!newFiles.length)
    return

  if (props.multiple) { files.value.push(...newFiles) }
  else {
    clear()
    files.value.push(...newFiles)
  }
  emit('upload', files.value)
}

function clear() {
  files.value.length = 0
}

function generateURL(file: File) {
  const fileSrc = URL.createObjectURL(file)
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc)
  }, 1000)
  return fileSrc
}

defineExpose({
  clear,
})
</script>

<template>
  <Label
    :class="cn('flex items-center justify-center rounded-md bg-secondary px-4 py-3 font-normal',
               props.class, isDragging && 'animate-pulse')"
    @dragover.prevent="onDragover"
    @dragleave="onDragleave"
    @drop.prevent="onDrop"
  >
    <slot v-if="!files.length">

      <div class="flex flex-col items-center justify-center gap-2">
        <template v-if="!props.images?.length">
          <FolderUp v-if="props.showIcon" :size="50" :stroke-width="1" />
          <span>Загрузить фото</span>
        </template>
        <template v-else>
          <NuxtImg
            v-for="image in images"
            :key="image.filename" format=".avif,.webp,.png,.jpg,.jpeg" class="aspect-video w-full object-cover"
            :src="`/images/projects/${image.projectUrlFriendly}/${image.filename}`"
          />
        </template>
      </div>
    </slot>
    <div v-else>
      <ul v-if="!props.showFiles">
        <div v-for="file in files" :key="file.name">{{ file.name }}</div>
      </ul>
      <div v-else class="flex flex-col gap-2">
        <div v-for="file in files" :key="file.name" class="aspect-video w-full">
          <NuxtImg class="aspect-video w-full object-cover" :src="generateURL(file)" />

        </div>
      </div>
    </div>
    <Input
      ref="inputRef" type="file" :multiple="props.multiple"
      accept=".avif,.webp,.png,.jpg,.jpeg"
      class="absolute h-[1px] w-[1px] overflow-hidden opacity-0"
      @change="onChange"
    />
  </Label>
</template>
