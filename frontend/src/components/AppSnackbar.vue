<script setup>
import { useSnackbarState } from '../composables/snackbar';

const state = useSnackbarState();
</script>

<template>
  <v-snackbar v-model="state.show" :color="state.color" timeout="3000" location="bottom right" variant="elevated">
    {{ state.text }}
    <template #actions>
      <v-btn variant="text" icon="mdi-close" size="small" @click="state.show = false" />
    </template>
  </v-snackbar>
</template>
