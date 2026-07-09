<script setup>
import { PRIORITY_OPTIONS } from '../utils/issueOptions';

const props = defineProps({
  priority: { type: String, required: true },
});

const colorMap = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.color]));
const iconMap = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.icon]));
const labelMap = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.title]));
</script>

<template>
  <v-chip :color="colorMap[priority] || 'grey'" size="small" variant="outlined" :prepend-icon="iconMap[priority]">
    {{ labelMap[priority] || priority }}
  </v-chip>
</template>
