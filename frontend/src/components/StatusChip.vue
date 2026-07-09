<script setup>
import { STATUS_OPTIONS } from '../utils/issueOptions';

const props = defineProps({
  status: { type: String, required: true },
});

const colorMap = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.color]));
const iconMap = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.icon]));
const labelMap = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.title]));
</script>

<template>
  <v-chip :color="colorMap[status] || 'grey'" size="small" variant="tonal" :prepend-icon="iconMap[status]" label>
    {{ labelMap[status] || status }}
  </v-chip>
</template>
