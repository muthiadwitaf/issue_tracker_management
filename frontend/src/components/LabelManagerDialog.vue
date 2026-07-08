<script setup>
import { onMounted, ref } from 'vue';
import { useLabelsStore } from '../stores/labels';
import { confirmDialog } from '../composables/confirm';
import { notify } from '../composables/snackbar';

const modelValue = defineModel({ type: Boolean, default: false });
const labelsStore = useLabelsStore();

const swatches = ['#C62828', '#0F6CBD', '#0F7B6C', '#B45309', '#6D28D9', '#BE185D', '#5C6B7A'];

const newName = ref('');
const newColor = ref(swatches[0]);

onMounted(() => labelsStore.fetchAll());

async function handleCreate() {
  if (!newName.value.trim()) return;
  await labelsStore.create({ name: newName.value.trim(), color: newColor.value });
  notify('Kategori berhasil dibuat');
  newName.value = '';
}

async function handleDelete(label) {
  const ok = await confirmDialog({ title: 'Hapus kategori', message: `Hapus kategori "${label.name}"?` });
  if (ok) {
    await labelsStore.remove(label.id);
    notify('Kategori dihapus', 'info');
  }
}
</script>

<template>
  <v-dialog v-model="modelValue" max-width="480">
    <v-card>
      <v-card-title>Kelola Kategori</v-card-title>
      <v-divider />
      <v-card-text>
        <v-chip
          v-for="label in labelsStore.items"
          :key="label.id"
          class="mr-2 mb-2"
          size="small"
          variant="flat"
          closable
          :style="{ backgroundColor: label.color, color: '#fff' }"
          @click:close="handleDelete(label)"
        >
          {{ label.name }}
        </v-chip>
        <p v-if="!labelsStore.items.length" class="text-medium-emphasis text-body-2">Belum ada kategori.</p>

        <v-divider class="my-4" />

        <v-text-field v-model="newName" label="Nama kategori baru" density="compact" @keyup.enter="handleCreate" />
        <div class="d-flex align-center ga-2 mt-2">
          <v-btn
            v-for="swatch in swatches"
            :key="swatch"
            :style="{ backgroundColor: swatch }"
            size="x-small"
            icon
            :variant="newColor === swatch ? 'outlined' : 'flat'"
            @click="newColor = swatch"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="modelValue = false">Tutup</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!newName.trim()" @click="handleCreate">Tambah Kategori</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
