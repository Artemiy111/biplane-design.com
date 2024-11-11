<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { FolderUp } from 'lucide-vue-next'

import type { ImageDto } from '~~/server/use-cases/types'

import { cn } from '~~/src/shared/lib/utils'
import { Input } from '~~/src/shared/ui/kit/input'

const props = defineProps<{
  multiple?: boolean
  showIcon?: boolean
  clearOnUpload?: boolean
  class?: HTMLAttributes['class']
  images?: ImageDto[]
}>()

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const id = useId()

const inputRef = useTemplateRef('inputRef')
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

  if (props.multiple) {
    files.value.push(...newFiles)
  }
  else {
    clear()
    files.value.push(...newFiles)
  }
  emit('upload', files.value)
  if (props.clearOnUpload)
    clear()
}

function clear() {
  files.value.length = 0
}

defineExpose({
  clear,
})
</script>

<template>
  <label
    :class="cn('flex items-center justify-center rounded-md bg-secondary px-4 py-3 font-normal',
               props.class, isDragging && 'animate-pulse')"
    :for="id"
    role="none"
    @dragleave="onDragleave"
    @dragover.prevent="onDragover"
    @drop.prevent="onDrop"
  >
    <template v-if="!files.length">
      <div class="flex flex-col items-center justify-center gap-2">
        <FolderUp
          v-if="props.showIcon"
          :size="50"
          :stroke-width="1"
        />
        <span>Загрузить изображения</span>

        <Input
          :id="id"
          ref="inputRef"
          accept=".avif,.webp,.png,.jpg,.jpeg"
          class="absolute size-px overflow-hidden opacity-0"
          :multiple="props.multiple"
          type="file"
          @change="onChange"
        />
      </div></template></label>
</template>
