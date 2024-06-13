<script setup lang="ts">
import { FolderUp } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import type { ImageDto } from '~/server/use-cases/types'

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
  <Label
    :class="cn('flex items-center justify-center rounded-md bg-secondary px-4 py-3 font-normal',
               props.class, isDragging && 'animate-pulse')"
    @dragover.prevent="onDragover"
    @dragleave="onDragleave"
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
          ref="inputRef"
          type="file"
          :multiple="props.multiple"
          accept=".avif,.webp,.png,.jpg,.jpeg"
          class="absolute h-[1px] w-[1px] overflow-hidden opacity-0"
          @change="onChange"
        />
      </div></template></Label>
</template>
