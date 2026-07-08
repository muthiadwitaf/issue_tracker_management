<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '../stores/projects';
import { useUsersStore } from '../stores/users';
import { useIssuesStore } from '../stores/issues';
import StatusChip from '../components/StatusChip.vue';
import PriorityChip from '../components/PriorityChip.vue';
import UserAvatar from '../components/UserAvatar.vue';
import LabelChip from '../components/LabelChip.vue';
import IssueFormDialog from '../components/IssueFormDialog.vue';
import { notify } from '../composables/snackbar';

const props = defineProps({ id: { type: String, required: true } });

const router = useRouter();
const projectsStore = useProjectsStore();
const usersStore = useUsersStore();
const issuesStore = useIssuesStore();
const dialogOpen = ref(false);

function isOverdue(issue) {
  return issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED';
}

async function load() {
  await Promise.all([projectsStore.fetchById(Number(props.id)), usersStore.fetchAll()]);
}

onMounted(load);

async function handleSave(payload) {
  await issuesStore.create(payload);
  notify('Issue created');
  await load();
}
</script>

<template>
  <div v-if="projectsStore.current">
    <div class="d-flex align-center mb-1">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.push('/projects')" />
      <div class="ml-2">
        <h1 class="text-h5 font-weight-medium">{{ projectsStore.current.name }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ projectsStore.current.description }}</p>
      </div>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="dialogOpen = true">New Issue</v-btn>
    </div>

    <v-card class="mt-4" variant="flat" border>
      <v-table hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="issue in projectsStore.current.issues"
            :key="issue.id"
            style="cursor: pointer"
            @click="router.push(`/issues/${issue.id}`)"
          >
            <td class="font-weight-medium">{{ issue.title }}</td>
            <td>
              <LabelChip v-for="l in issue.labels" :key="l.labelId" :label="l.label" class="mr-1 mb-1" />
            </td>
            <td><StatusChip :status="issue.status" /></td>
            <td><PriorityChip :priority="issue.priority" /></td>
            <td>
              <div v-if="issue.assignee" class="d-flex align-center">
                <UserAvatar :name="issue.assignee.name" :size="22" class="mr-2" />
                {{ issue.assignee.name }}
              </div>
              <span v-else class="text-medium-emphasis">Unassigned</span>
            </td>
            <td :class="{ 'text-error font-weight-medium': isOverdue(issue) }">
              {{ issue.dueDate ? new Date(issue.dueDate).toLocaleDateString('id-ID') : '—' }}
            </td>
          </tr>
          <tr v-if="!projectsStore.current.issues.length">
            <td colspan="6" class="text-center text-medium-emphasis py-8">
              <v-icon icon="mdi-check-circle-outline" size="32" class="mb-2 d-block mx-auto" />
              No issues in this project yet.
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <IssueFormDialog
      v-model="dialogOpen"
      :fixed-project-id="Number(id)"
      :projects="[projectsStore.current]"
      :users="usersStore.items"
      @save="handleSave"
    />
  </div>
</template>
