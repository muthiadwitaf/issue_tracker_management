<script setup>
import { onMounted, ref } from 'vue';
import eventService from '../services/eventService';
import UserAvatar from './UserAvatar.vue';
import AttachmentList from './AttachmentList.vue';

const props = defineProps({ issueId: { type: Number, required: true } });

const events = ref([]);
const loading = ref(true);
const commentBody = ref('');
const posting = ref(false);

const iconMap = {
  CREATED: 'mdi-flag-plus-outline',
  COMMENT: 'mdi-comment-outline',
  STATUS_CHANGE: 'mdi-progress-clock',
  ASSIGNMENT_CHANGE: 'mdi-account-arrow-right-outline',
  LABEL_CHANGE: 'mdi-tag-outline',
  START_DATE_CHANGE: 'mdi-calendar-start-outline',
  DUE_DATE_CHANGE: 'mdi-calendar-end-outline',
};

async function load() {
  loading.value = true;
  events.value = await eventService.list(props.issueId);
  loading.value = false;
}

onMounted(load);

defineExpose({ reload: load });

function formatTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

async function submitComment() {
  if (!commentBody.value.trim()) return;
  posting.value = true;
  try {
    await eventService.createComment(props.issueId, {
      body: commentBody.value.trim(),
    });
    commentBody.value = '';
    await load();
  } finally {
    posting.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular indeterminate size="24" color="primary" />
    </div>
    <v-timeline v-else density="compact" side="end" truncate-line="both">
      <v-timeline-item
        v-for="event in events"
        :key="event.id"
        :dot-color="event.type === 'COMMENT' ? 'primary' : 'secondary'"
        size="small"
      >
        <template #icon>
          <v-icon :icon="iconMap[event.type]" size="14" color="white" />
        </template>
        <div class="d-flex align-center mb-1">
          <UserAvatar v-if="event.actor" :name="event.actor.name" :size="20" class="mr-2" />
          <v-avatar v-else :size="20" color="secondary" variant="tonal" class="mr-2">
            <v-icon icon="mdi-cog-outline" size="12" />
          </v-avatar>
          <span class="font-weight-medium text-body-2 mr-2">{{ event.actor?.name || 'System' }}</span>
          <span class="text-caption text-medium-emphasis">{{ formatTime(event.createdAt) }}</span>
        </div>
        <div v-if="event.type === 'COMMENT'" class="text-body-2">{{ event.body }}</div>
        <div v-else class="text-body-2 text-medium-emphasis font-italic">{{ event.detail }}</div>
        <AttachmentList :attachments="event.attachments" />
      </v-timeline-item>
      <p v-if="!events.length" class="text-medium-emphasis text-body-2">Belum ada aktivitas.</p>
    </v-timeline>

    <v-divider class="my-4" />

    <v-textarea
      v-model="commentBody"
      label="Tulis komentar..."
      rows="2"
      auto-grow
      density="comfortable"
    />
    <div class="d-flex justify-end">
      <v-btn color="primary" variant="flat" :loading="posting" :disabled="!commentBody.trim()" @click="submitComment">
        Kirim Komentar
      </v-btn>
    </div>
  </div>
</template>
