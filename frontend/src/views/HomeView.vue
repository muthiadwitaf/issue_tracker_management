<script setup>
import { useAuthStore } from '../stores/auth';
import DashboardView from './DashboardView.vue';
import LoginView from './LoginView.vue';

const auth = useAuthStore();
</script>

<template>
  <DashboardView v-if="auth.isAuthenticated" />
  <LoginView v-else />
</template>
