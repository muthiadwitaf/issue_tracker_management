<script setup>
import { useConfirmState } from '../composables/confirm';

const state = useConfirmState();

function respond(value) {
  state.show = false;
  if (state.resolve) state.resolve(value);
}
</script>

<template>
  <v-dialog v-model="state.show" max-width="420" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-alert-circle-outline" :color="state.color" class="mr-2" />
        {{ state.title }}
      </v-card-title>
      <v-card-text>{{ state.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="respond(false)">Batal</v-btn>
        <v-btn :color="state.color" variant="flat" @click="respond(true)">{{ state.confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
