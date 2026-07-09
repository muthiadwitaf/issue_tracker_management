<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  project: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref({ name: '', description: '' });

watch(
  () => [props.modelValue, props.project],
  ([open]) => {
    if (open) {
      form.value = props.project
        ? { name: props.project.name, description: props.project.description || '' }
        : { name: '', description: '' };
    }
  },
);

function close() {
  emit('update:modelValue', false);
}

function save() {
  emit('save', { ...form.value });
  close();
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="500" @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>{{ project ? 'Edit Proyek' : 'Proyek Baru' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.name" label="Nama Proyek" autofocus />
        <v-textarea v-model="form.description" label="Deskripsi" rows="3" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Batal</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!form.name" @click="save">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
