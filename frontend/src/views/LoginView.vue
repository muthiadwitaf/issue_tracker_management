<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  if (!email.value || !password.value) return;
  loading.value = true;
  error.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push(route.query.redirect || '/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Login gagal. Periksa email dan password.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card width="380" variant="flat" border class="pa-2">
      <v-card-item>
        <div class="d-flex flex-column align-center mb-4">
          <v-avatar color="primary" size="56" class="mb-3">
            <v-icon icon="mdi-clipboard-text-clock-outline" size="28" color="white" />
          </v-avatar>
          <h1 class="text-h6 font-weight-medium">Issue Tracker</h1>
          <p class="text-body-2 text-medium-emphasis">Masuk untuk melanjutkan</p>
        </div>
      </v-card-item>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            autofocus
            class="mb-2"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            @keyup.enter="submit"
          />
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2">
            {{ error }}
          </v-alert>
          <v-btn
            block
            color="primary"
            variant="flat"
            class="mt-4"
            size="large"
            :loading="loading"
            :disabled="!email || !password"
            @click="submit"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
