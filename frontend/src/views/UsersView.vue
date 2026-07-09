<script setup>
import { onMounted, ref } from 'vue';
import { useUsersStore } from '../stores/users';
import UserFormDialog from '../components/UserFormDialog.vue';
import UserAvatar from '../components/UserAvatar.vue';
import { confirmDialog } from '../composables/confirm';
import { notify } from '../composables/snackbar';

const store = useUsersStore();
const dialogOpen = ref(false);
const editingUser = ref(null);

onMounted(() => store.fetchAll());

function openCreate() {
  editingUser.value = null;
  dialogOpen.value = true;
}

function openEdit(user) {
  editingUser.value = user;
  dialogOpen.value = true;
}

async function handleSave(payload) {
  if (editingUser.value) {
    await store.update(editingUser.value.id, payload);
    notify('Pengguna berhasil diperbarui');
  } else {
    await store.create(payload);
    notify('Pengguna berhasil dibuat');
  }
}

async function handleDelete(user) {
  const ok = await confirmDialog({ title: 'Hapus Pengguna', message: `Hapus pengguna "${user.name}"?` });
  if (ok) {
    await store.remove(user.id);
    notify('Pengguna berhasil dihapus', 'info');
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-medium">Pengguna</h1>
        <p class="text-body-2 text-medium-emphasis">{{ store.items.length }} pengguna</p>
      </div>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="openCreate">Pengguna Baru</v-btn>
    </div>

    <v-card variant="flat" border>
      <v-table hover>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th class="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in store.items" :key="user.id">
            <td>
              <div class="d-flex align-center py-2">
                <UserAvatar :name="user.name" class="mr-3" />
                {{ user.name }}
              </div>
            </td>
            <td class="text-medium-emphasis">{{ user.email }}</td>
            <td class="text-right">
              <v-btn icon="mdi-pencil-outline" variant="text" size="small" @click="openEdit(user)" />
              <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="handleDelete(user)" />
            </td>
          </tr>
          <tr v-if="!store.loading && !store.items.length">
            <td colspan="3" class="text-center text-medium-emphasis py-8">Belum ada pengguna.</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <UserFormDialog v-model="dialogOpen" :user="editingUser" @save="handleSave" />
  </div>
</template>
