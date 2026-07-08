<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '../stores/projects';
import ProjectFormDialog from '../components/ProjectFormDialog.vue';
import { confirmDialog } from '../composables/confirm';
import { notify } from '../composables/snackbar';

const router = useRouter();
const store = useProjectsStore();
const dialogOpen = ref(false);
const editingProject = ref(null);

onMounted(() => store.fetchAll());

function openCreate() {
  editingProject.value = null;
  dialogOpen.value = true;
}

function openEdit(project) {
  editingProject.value = project;
  dialogOpen.value = true;
}

async function handleSave(payload) {
  if (editingProject.value) {
    await store.update(editingProject.value.id, payload);
    notify('Project updated');
  } else {
    await store.create(payload);
    notify('Project created');
  }
}

async function handleDelete(project) {
  const ok = await confirmDialog({
    title: 'Delete project',
    message: `Delete project "${project.name}"? This also removes its issues.`,
  });
  if (ok) {
    await store.remove(project.id);
    notify('Project deleted', 'info');
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-medium">Projects</h1>
        <p class="text-body-2 text-medium-emphasis">{{ store.items.length }} total</p>
      </div>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="openCreate">New Project</v-btn>
    </div>

    <v-row>
      <v-col v-for="project in store.items" :key="project.id" cols="12" sm="6" md="4">
        <v-card variant="flat" border class="d-flex flex-column" height="100%">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" variant="tonal" rounded="lg">
                <v-icon icon="mdi-folder-outline" />
              </v-avatar>
            </template>
            <v-card-title style="cursor: pointer" @click="router.push(`/projects/${project.id}`)">
              {{ project.name }}
            </v-card-title>
            <v-card-subtitle>{{ project._count?.issues || 0 }} issues</v-card-subtitle>
          </v-card-item>
          <v-card-text class="text-body-2 flex-grow-1">{{ project.description || 'No description' }}</v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="router.push(`/projects/${project.id}`)">View</v-btn>
            <v-spacer />
            <v-btn icon="mdi-pencil-outline" variant="text" size="small" @click="openEdit(project)" />
            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="handleDelete(project)" />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="!store.loading && !store.items.length" cols="12">
        <v-alert type="info" variant="tonal" icon="mdi-information-outline">
          No projects yet. Create one to get started.
        </v-alert>
      </v-col>
    </v-row>

    <ProjectFormDialog v-model="dialogOpen" :project="editingProject" @save="handleSave" />
  </div>
</template>
