<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import searchService from '../services/searchService';

const router = useRouter();
const { mobile } = useDisplay();
const query = ref('');
const results = ref({ issues: [], projects: [] });
const menuOpen = ref(false);
const dialogOpen = ref(false);
const loading = ref(false);
let debounceTimer = null;

function onInput() {
  clearTimeout(debounceTimer);
  if (!query.value.trim()) {
    results.value = { issues: [], projects: [] };
    menuOpen.value = false;
    return;
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    try {
      results.value = await searchService.search(query.value.trim());
      menuOpen.value = true;
    } finally {
      loading.value = false;
    }
  }, 300);
}

function reset() {
  menuOpen.value = false;
  dialogOpen.value = false;
  query.value = '';
  results.value = { issues: [], projects: [] };
}

function goToIssue(issue) {
  reset();
  router.push(`/issues/${issue.id}`);
}

function goToProject(project) {
  reset();
  router.push(`/projects/${project.id}`);
}
</script>

<template>
  <v-btn v-if="mobile" icon="mdi-magnify" variant="text" @click="dialogOpen = true" />
  <v-dialog v-if="mobile" v-model="dialogOpen" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="primary" density="comfortable">
        <v-btn icon="mdi-arrow-left" @click="reset" />
        <v-text-field
          v-model="query"
          autofocus
          placeholder="Cari issue & proyek..."
          density="compact"
          hide-details
          variant="solo-filled"
          flat
          clearable
          class="mr-2"
          @update:model-value="onInput"
        />
      </v-toolbar>
      <v-list v-if="results.issues.length || results.projects.length">
        <v-list-subheader v-if="results.projects.length">Proyek</v-list-subheader>
        <v-list-item
          v-for="project in results.projects"
          :key="`p-${project.id}`"
          :title="project.name"
          prepend-icon="mdi-folder-outline"
          @click="goToProject(project)"
        />
        <v-list-subheader v-if="results.issues.length">Issue</v-list-subheader>
        <v-list-item
          v-for="issue in results.issues"
          :key="`i-${issue.id}`"
          :title="issue.title"
          :subtitle="issue.project?.name"
          prepend-icon="mdi-alert-circle-outline"
          @click="goToIssue(issue)"
        />
      </v-list>
      <v-card-text v-else-if="query.trim()" class="text-medium-emphasis text-body-2">
        {{ loading ? 'Mencari...' : 'Tidak ada hasil.' }}
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-menu v-else v-model="menuOpen" :close-on-content-click="false" location="bottom start" min-width="360">
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        v-model="query"
        placeholder="Cari issue & proyek..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        variant="solo-filled"
        flat
        style="max-width: 320px"
        clearable
        @update:model-value="onInput"
      />
    </template>
    <v-card>
      <v-list v-if="results.issues.length || results.projects.length" density="compact">
        <v-list-subheader v-if="results.projects.length">Proyek</v-list-subheader>
        <v-list-item
          v-for="project in results.projects"
          :key="`p-${project.id}`"
          :title="project.name"
          prepend-icon="mdi-folder-outline"
          @click="goToProject(project)"
        />
        <v-list-subheader v-if="results.issues.length">Issue</v-list-subheader>
        <v-list-item
          v-for="issue in results.issues"
          :key="`i-${issue.id}`"
          :title="issue.title"
          :subtitle="issue.project?.name"
          prepend-icon="mdi-alert-circle-outline"
          @click="goToIssue(issue)"
        />
      </v-list>
      <v-card-text v-else class="text-medium-emphasis text-body-2">
        {{ loading ? 'Mencari...' : 'Tidak ada hasil.' }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>
