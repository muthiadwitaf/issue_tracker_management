<script setup>
defineProps({
  label: { type: Object, required: true },
  closable: { type: Boolean, default: false },
});

defineEmits(['close']);
</script>

<template>
  <v-chip
    size="small"
    variant="flat"
    :style="{ backgroundColor: label.color, color: '#fff' }"
    :closable="closable"
    @click:close="$emit('close')"
  >
    {{ label.name }}
  </v-chip>
</template>
