<script setup>
import { onMounted } from 'vue';
import { useLabelsStore } from '../stores/labels';

const modelValue = defineModel({ type: Array, default: () => [] });
const labelsStore = useLabelsStore();

onMounted(() => {
  if (!labelsStore.items.length) labelsStore.fetchAll();
});
</script>

<template>
  <v-select
    v-model="modelValue"
    :items="labelsStore.items"
    item-title="name"
    item-value="id"
    label="Kategori"
    prepend-inner-icon="mdi-tag-outline"
    multiple
    chips
    closable-chips
    clearable
  >
    <template #chip="{ item, props: chipProps }">
      <v-chip
        v-bind="chipProps"
        size="small"
        :style="{ backgroundColor: item.raw.color, color: '#fff' }"
      >
        {{ item.raw.name }}
      </v-chip>
    </template>
  </v-select>
</template>
