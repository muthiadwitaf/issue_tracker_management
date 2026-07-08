<script setup>
import { fileUrl, isImage, formatFileSize } from '../utils/files';

defineProps({
  attachments: { type: Array, default: () => [] },
});
</script>

<template>
  <div v-if="attachments?.length" class="d-flex flex-wrap ga-2 mt-1">
    <a
      v-for="att in attachments"
      :key="att.id"
      :href="fileUrl(att.filename)"
      target="_blank"
      rel="noopener"
      class="text-decoration-none"
    >
      <v-chip size="small" variant="outlined" :prepend-icon="isImage(att.mimeType) ? 'mdi-image-outline' : 'mdi-paperclip'">
        {{ att.originalName }}
        <span class="text-caption text-medium-emphasis ml-1">({{ formatFileSize(att.size) }})</span>
      </v-chip>
    </a>
  </div>
</template>
