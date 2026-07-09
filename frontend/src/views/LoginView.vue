<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const quickLoginEmail = ref('');
// Trik agar browser tidak auto-fill kredensial tersimpan: field dikunci (readonly)
// sampai user benar-benar mengklik/fokus ke field. autocomplete="off" saja tidak
// cukup karena banyak browser mengabaikannya khusus untuk form login.
const emailLocked = ref(true);
const passwordLocked = ref(true);
const emailField = ref(null);
const passwordField = ref(null);

function unlockOnFirstInteraction(fieldRef, lockedRef) {
  const input = fieldRef.value?.$el?.querySelector('input');
  if (!input) return;
  const unlock = () => {
    lockedRef.value = false;
  };
  input.addEventListener('mousedown', unlock, { once: true });
  input.addEventListener('keydown', unlock, { once: true });
}

onMounted(async () => {
  await nextTick();
  email.value = '';
  password.value = '';
  unlockOnFirstInteraction(emailField, emailLocked);
  unlockOnFirstInteraction(passwordField, passwordLocked);
});

// Password default akun-akun demo/seed. Hanya berlaku untuk lingkungan
// internal/dev — jangan pakai pola ini jika tiap user punya password sendiri.
const QUICK_LOGIN_PASSWORD = 'password123';
const QUICK_LOGIN_USERS = [
  { name: 'Wafi', email: 'xafihernand27@gmail.com' },
  { name: 'Adilson', email: 'adil@matrixintegrasi.com' },
  { name: 'Gorby', email: 'gorby@matrixintegrasi.com' },
  { name: 'Puspita', email: 'pita@matrixintegrasi.com' },
  { name: 'Faris', email: 'faris@matrixintegrasi.com' },
  { name: 'Hamzah', email: 'hamzah@matrixintegrasi.com' },
  { name: 'Hanif', email: 'hanif@matrixintegrasi.com' },
  { name: 'Imron', email: 'imron@matrixintegrasi.com' },
  { name: 'Iskandar', email: 'is@matrixintegrasi.com' },
  { name: 'Yusuf', email: 'yusuf@matrixintegrasi.com' },
  { name: 'Husein', email: 'husein@matrixintegrasi.com' },
  { name: "Muthi'ah", email: 'tia@matrixintegrasi.com' },
  { name: 'Anis', email: 'anis@matrixintegrasi.com' },
  { name: 'Untung', email: 'toto@matrixintegrasi.com' },
  { name: 'Zaka', email: 'zaka@matrixintegrasi.com' },
];

async function doLogin(loginEmail, loginPassword) {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(loginEmail, loginPassword);
    router.push(route.query.redirect || '/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Login gagal. Periksa email dan password.';
  } finally {
    loading.value = false;
    quickLoginEmail.value = '';
  }
}

function submit() {
  if (!email.value || !password.value) return;
  doLogin(email.value, password.value);
}

function quickLogin(user) {
  if (loading.value) return;
  quickLoginEmail.value = user.email;
  doLogin(user.email, QUICK_LOGIN_PASSWORD);
}
</script>

<template>
  <div class="d-flex flex-column align-center justify-center pa-4" style="min-height: 100vh">
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
        <v-form autocomplete="off" @submit.prevent="submit">
          <v-text-field
            ref="emailField"
            v-model="email"
            label="Email"
            type="email"
            autocomplete="off"
            :readonly="emailLocked"
            prepend-inner-icon="mdi-email-outline"
            autofocus
            class="mb-2"
          />
          <v-text-field
            ref="passwordField"
            v-model="password"
            label="Kata Sandi"
            type="password"
            autocomplete="off"
            :readonly="passwordLocked"
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
            :loading="loading && !quickLoginEmail"
            :disabled="!email || !password"
            @click="submit"
          >
            Masuk
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card width="380" variant="flat" border class="pa-4 mt-4">
      <p class="text-caption text-medium-emphasis mb-3 text-center">
        Atau login cepat sebagai:
      </p>
      <div class="d-flex flex-wrap justify-center ga-2">
        <v-chip
          v-for="user in QUICK_LOGIN_USERS"
          :key="user.email"
          variant="tonal"
          color="primary"
          rounded="pill"
          class="font-weight-medium"
          :disabled="loading"
          @click="quickLogin(user)"
        >
          <v-progress-circular
            v-if="quickLoginEmail === user.email"
            indeterminate
            size="14"
            width="2"
            class="mr-2"
          />
          {{ user.name }}
        </v-chip>
      </div>
    </v-card>
  </div>
</template>
