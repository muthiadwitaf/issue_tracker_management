<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme, useDisplay } from 'vuetify';
import AppSnackbar from './components/AppSnackbar.vue';
import AppConfirmDialog from './components/AppConfirmDialog.vue';
import GlobalSearch from './components/GlobalSearch.vue';
import NotificationBell from './components/NotificationBell.vue';
import UserAvatar from './components/UserAvatar.vue';
import { useUsersStore } from './stores/users';
import { useAuthStore } from './stores/auth';

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const drawer = ref(true);
const theme = useTheme();
const isDark = ref(theme.global.name.value === 'dark');
const usersStore = useUsersStore();
const auth = useAuthStore();

const showsLoginScreen = computed(
  () => route.name === 'login' || (route.name === 'home' && !auth.isAuthenticated),
);

onMounted(async () => {
  await auth.restoreSession();
  if (auth.isAuthenticated) usersStore.fetchAll();
});

function toggleTheme() {
  isDark.value = !isDark.value;
  const name = isDark.value ? 'dark' : 'light';
  theme.change(name);
  localStorage.setItem('theme', name);
}

function logout() {
  auth.logout();
  router.push('/login');
}

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Proyek', icon: 'mdi-folder-multiple-outline', to: '/projects' },
  { title: 'Issue', icon: 'mdi-alert-circle-outline', to: '/issues' },
  { title: 'Pengguna', icon: 'mdi-account-group-outline', to: '/users' },
];
</script>

<template>
  <v-app>
    <template v-if="!showsLoginScreen">
      <v-app-bar color="primary" density="comfortable" elevation="2">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-icon icon="mdi-clipboard-text-clock-outline" class="mr-2" />
        <v-toolbar-title v-if="!mobile" class="font-weight-medium" style="flex: 0 0 auto">
          Issue Tracker
        </v-toolbar-title>

        <div v-if="!mobile" class="ml-4" style="max-width: 320px; width: 100%">
          <GlobalSearch />
        </div>

        <v-spacer />

        <GlobalSearch v-if="mobile" />
        <NotificationBell />

        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
        />
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" elevation="1">
        <div v-if="auth.user" class="d-flex align-center pa-3">
          <UserAvatar :name="auth.user.name" :size="36" class="mr-3" />
          <div class="flex-grow-1" style="min-width: 0">
            <div class="font-weight-medium text-truncate">{{ auth.user.name }}</div>
            <div class="text-caption text-medium-emphasis text-truncate">{{ auth.user.email }}</div>
          </div>
          <v-btn icon="mdi-logout" variant="text" size="small" title="Keluar" @click="logout" />
        </div>
        <v-divider />
        <v-list nav class="pa-2">
          <v-list-item
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            rounded="lg"
            class="mb-1"
          />
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container v-if="!showsLoginScreen" fluid class="pa-6">
        <router-view />
      </v-container>
      <router-view v-else />
    </v-main>

    <AppSnackbar />
    <AppConfirmDialog />
  </v-app>
</template>
