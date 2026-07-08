<script setup>
const props = defineProps({
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 28 },
});

const roleColors = ['#1E3A5F', '#0F6CBD', '#0F7B6C', '#B45309', '#6D28D9', '#BE185D'];

function colorFor(name) {
  if (!name) return '#5C6B7A';
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return roleColors[Math.abs(hash) % roleColors.length];
}

function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
</script>

<template>
  <v-avatar :size="size" :color="colorFor(name)">
    <span class="text-caption font-weight-medium" style="color: white">{{ initials(name) }}</span>
  </v-avatar>
</template>
