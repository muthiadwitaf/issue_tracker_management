<script setup>
defineProps({
  status: { type: String, required: true },
});

const colorMap = {
  OPEN: 'statusOpen',
  IN_PROGRESS: 'statusInProgress',
  RESOLVED: 'statusResolved',
  TESTING: 'statusTesting',
  DEPLOY: 'statusDeploy',
  TESTED: 'statusTested',
  REVIEWED: 'statusReviewed',
  CLOSED: 'statusClosed',
};

const iconMap = {
  OPEN: 'mdi-alert-circle-outline',
  IN_PROGRESS: 'mdi-progress-clock',
  RESOLVED: 'mdi-check-circle-outline',
  TESTING: 'mdi-flask-outline',
  DEPLOY: 'mdi-rocket-launch-outline',
  TESTED: 'mdi-check-decagram-outline',
  REVIEWED: 'mdi-eye-check-outline',
  CLOSED: 'mdi-archive-outline',
};

const labelMap = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  TESTING: 'Testing',
  DEPLOY: 'Deploy',
  TESTED: 'Tested',
  REVIEWED: 'Reviewed',
  CLOSED: 'Closed',
};
</script>

<template>
  <v-chip :color="colorMap[status] || 'grey'" size="small" variant="tonal" :prepend-icon="iconMap[status]" label>
    {{ labelMap[status] || status }}
  </v-chip>
</template>
