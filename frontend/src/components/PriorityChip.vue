<script setup>
defineProps({
  priority: { type: String, required: true },
});

const colorMap = {
  LOW: 'priorityLow',
  MEDIUM: 'priorityMedium',
  HIGH: 'priorityHigh',
  CRITICAL: 'priorityCritical',
};

const iconMap = {
  LOW: 'mdi-chevron-down',
  MEDIUM: 'mdi-equal',
  HIGH: 'mdi-chevron-up',
  CRITICAL: 'mdi-chevron-double-up',
};

const labelMap = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};
</script>

<template>
  <v-chip :color="colorMap[priority] || 'grey'" size="small" variant="outlined" :prepend-icon="iconMap[priority]">
    {{ labelMap[priority] || priority }}
  </v-chip>
</template>
