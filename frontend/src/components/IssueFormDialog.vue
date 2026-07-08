<script setup>
import { ref, watch } from 'vue';
import LabelPicker from './LabelPicker.vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  issue: { type: Object, default: null },
  projects: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  fixedProjectId: { type: Number, default: null },
});

const emit = defineEmits(['update:modelValue', 'save']);

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const auth = useAuthStore();

const form = ref({
  title: '',
  moduleName: '',
  informantName: '',
  description: '',
  priority: 'MEDIUM',
  projectId: null,
  assigneeId: null,
  startDate: '',
  dueDate: '',
  labelIds: [],
  files: [],
});

watch(
  () => [props.modelValue, props.issue],
  ([open]) => {
    if (!open) return;
    if (props.issue) {
      form.value = {
        title: props.issue.title,
        moduleName: props.issue.moduleName || '',
        informantName: props.issue.informantName || '',
        description: props.issue.description || '',
        priority: props.issue.priority,
        projectId: props.issue.projectId,
        assigneeId: props.issue.assigneeId,
        startDate: props.issue.startDate ? props.issue.startDate.slice(0, 10) : '',
        dueDate: props.issue.dueDate ? props.issue.dueDate.slice(0, 10) : '',
        labelIds: (props.issue.labels || []).map((l) => l.labelId),
        files: [],
      };
    } else {
      form.value = {
        title: '',
        moduleName: '',
        informantName: '',
        description: '',
        priority: 'MEDIUM',
        projectId: props.fixedProjectId,
        assigneeId: null,
        startDate: '',
        dueDate: '',
        labelIds: [],
        files: [],
      };
    }
  },
);

function close() {
  emit('update:modelValue', false);
}

function save() {
  emit('save', { ...form.value, startDate: form.value.startDate || null, dueDate: form.value.dueDate || null });
  close();
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="600" @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>{{ issue ? 'Edit Issue' : 'New Issue' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.title" label="Title" autofocus />
        <v-text-field
          v-model="form.moduleName"
          label="Module/Function Name"
          prepend-inner-icon="mdi-puzzle-outline"
          placeholder="e.g. Payroll Calculation, Login API"
        />
        <v-textarea v-model="form.description" label="Description" rows="3" />
        <v-select
          v-if="!fixedProjectId"
          v-model="form.projectId"
          :items="projects"
          item-title="name"
          item-value="id"
          label="Project"
        />
        <v-select v-model="form.priority" :items="priorities" label="Priority" />
        <v-row dense>
          <v-col cols="6">
            <v-text-field
              v-model="form.startDate"
              type="date"
              label="Start date"
              prepend-inner-icon="mdi-calendar-start-outline"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="form.dueDate"
              type="date"
              label="Due date"
              prepend-inner-icon="mdi-calendar-end-outline"
            />
          </v-col>
        </v-row>
        <LabelPicker v-model="form.labelIds" />

        <v-alert v-if="!issue" type="info" variant="tonal" density="compact" class="mb-4">
          Reporter: <strong>{{ auth.user?.name }}</strong> (otomatis dari user yang sedang login)
        </v-alert>
        <v-text-field
          v-model="form.informantName"
          label="Informant"
          prepend-inner-icon="mdi-account-voice"
          placeholder="Nama/instansi yang menginfokan, mis. User Dashboard Polda Jabar"
          hint="Isi jika yang melaporkan bukan reporter sistem (mis. user dari instansi lain)"
          persistent-hint
        />

        <v-select
          v-model="form.assigneeId"
          :items="users"
          item-title="name"
          item-value="id"
          label="Assignee (programmer)"
          clearable
          class="mt-4"
        />
        <v-file-input
          v-if="!issue"
          v-model="form.files"
          label="Evidence (screenshots, logs, dll.)"
          prepend-icon="mdi-paperclip"
          multiple
          chips
          show-size
          density="comfortable"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!form.title || !form.projectId" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
