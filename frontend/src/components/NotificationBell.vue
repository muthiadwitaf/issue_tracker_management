<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import notificationService from '../services/notificationService';

const router = useRouter();
const auth = useAuthStore();
const notifications = ref([]);
let pollTimer = null;

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

async function load() {
  if (!auth.user?.id) {
    notifications.value = [];
    return;
  }
  notifications.value = await notificationService.list(auth.user.id);
}

async function handleClick(notification) {
  if (!notification.read) {
    await notificationService.markRead(notification.id);
    notification.read = true;
  }
  if (notification.issueId) {
    router.push(`/issues/${notification.issueId}`);
  }
}

async function markAllRead() {
  if (!auth.user?.id) return;
  await notificationService.markAllRead(auth.user.id);
  notifications.value.forEach((n) => (n.read = true));
}

function formatTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

onMounted(() => {
  load();
  pollTimer = setInterval(load, 20000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

watch(() => auth.user?.id, load);
</script>

<template>
  <v-menu location="bottom end" width="360">
    <template #activator="{ props: menuProps }">
      <v-btn icon variant="text" v-bind="menuProps">
        <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error">
          <v-icon icon="mdi-bell-outline" />
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex align-center text-subtitle-2">
        Notifikasi
        <v-spacer />
        <v-btn v-if="unreadCount > 0" size="x-small" variant="text" @click="markAllRead">Tandai semua dibaca</v-btn>
      </v-card-title>
      <v-divider />
      <v-list max-height="360" class="overflow-y-auto">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          :style="!notification.read ? 'background-color: rgba(var(--v-theme-primary), 0.08); border-left: 3px solid rgb(var(--v-theme-primary))' : 'border-left: 3px solid transparent'"
          @click="handleClick(notification)"
        >
          <v-list-item-title class="text-wrap text-body-2" :class="{ 'font-weight-bold': !notification.read }">
            {{ notification.message }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ formatTime(notification.createdAt) }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="!notifications.length" title="Tidak ada notifikasi" class="text-medium-emphasis" />
      </v-list>
    </v-card>
  </v-menu>
</template>
