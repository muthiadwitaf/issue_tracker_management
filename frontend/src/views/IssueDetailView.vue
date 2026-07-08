<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIssuesStore } from '../stores/issues';
import { useUsersStore } from '../stores/users';
import StatusChip from '../components/StatusChip.vue';
import PriorityChip from '../components/PriorityChip.vue';
import UserAvatar from '../components/UserAvatar.vue';
import LabelPicker from '../components/LabelPicker.vue';
import LabelChip from '../components/LabelChip.vue';
import IssueActivityTimeline from '../components/IssueActivityTimeline.vue';
import { notify } from '../composables/snackbar';

const props = defineProps({ id: { type: String, required: true } });

const router = useRouter();
const issuesStore = useIssuesStore();
const usersStore = useUsersStore();

const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'TESTING', 'DEPLOY', 'TESTED', 'REVIEWED', 'CLOSED'];

const statusForm = ref({ status: 'OPEN', solution: '' });
const statusFiles = ref([]);
const assigneeId = ref(null);
const startDate = ref('');
const dueDate = ref('');
const labelIds = ref([]);
const saving = ref(false);
const assigning = ref(false);
const savingDates = ref(false);
const savingLabels = ref(false);
const activityTimeline = ref(null);

const isOverdue = computed(() => {
  const issue = issuesStore.current;
  if (!issue?.dueDate) return false;
  return new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED';
});

async function load() {
  await Promise.all([issuesStore.fetchById(Number(props.id)), usersStore.fetchAll()]);
  if (issuesStore.current) {
    statusForm.value = { status: issuesStore.current.status, solution: issuesStore.current.solution || '' };
    assigneeId.value = issuesStore.current.assigneeId;
    startDate.value = issuesStore.current.startDate ? issuesStore.current.startDate.slice(0, 10) : '';
    dueDate.value = issuesStore.current.dueDate ? issuesStore.current.dueDate.slice(0, 10) : '';
    labelIds.value = (issuesStore.current.labels || []).map((l) => l.labelId);
  }
}

onMounted(load);
watch(() => props.id, load);

async function saveStatus() {
  saving.value = true;
  try {
    await issuesStore.updateStatus(Number(props.id), {
      ...statusForm.value,
      files: statusFiles.value,
    });
    statusFiles.value = [];
    notify('Status updated');
    activityTimeline.value?.reload();
  } finally {
    saving.value = false;
  }
}

async function saveAssignee() {
  assigning.value = true;
  try {
    await issuesStore.assign(Number(props.id), assigneeId.value);
    notify('Assignment updated');
    activityTimeline.value?.reload();
  } finally {
    assigning.value = false;
  }
}

async function saveDates() {
  savingDates.value = true;
  try {
    await Promise.all([
      issuesStore.updateStartDate(Number(props.id), startDate.value || null),
      issuesStore.updateDueDate(Number(props.id), dueDate.value || null),
    ]);
    notify('Timeline updated');
    activityTimeline.value?.reload();
  } finally {
    savingDates.value = false;
  }
}

async function saveLabels() {
  savingLabels.value = true;
  try {
    await issuesStore.updateLabels(Number(props.id), labelIds.value);
    notify('Kategori updated');
    activityTimeline.value?.reload();
  } finally {
    savingLabels.value = false;
  }
}
</script>

<template>
  <div v-if="issuesStore.current">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.push('/issues')" />
      <h1 class="text-h5 font-weight-medium ml-2">{{ issuesStore.current.title }}</h1>
      <v-spacer />
      <StatusChip :status="issuesStore.current.status" />
      <PriorityChip class="ml-2" :priority="issuesStore.current.priority" />
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="mb-4" variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-text-box-outline" class="mr-2" size="20" />
            Description
          </v-card-title>
          <v-divider />
          <v-card-text>{{ issuesStore.current.description || 'No description provided.' }}</v-card-text>
          <v-divider />
          <v-card-text>
            <LabelChip v-for="l in issuesStore.current.labels" :key="l.labelId" :label="l.label" class="mr-2" />
            <span v-if="!issuesStore.current.labels?.length" class="text-caption text-medium-emphasis">Tidak ada kategori</span>
          </v-card-text>
          <v-divider />
          <v-card-text class="d-flex flex-wrap text-caption text-medium-emphasis ga-4">
            <span><v-icon icon="mdi-folder-outline" size="14" class="mr-1" />{{ issuesStore.current.project?.name }}</span>
            <span v-if="issuesStore.current.moduleName">
              <v-icon icon="mdi-puzzle-outline" size="14" class="mr-1" />{{ issuesStore.current.moduleName }}
            </span>
            <span><v-icon icon="mdi-account-outline" size="14" class="mr-1" />Reported by {{ issuesStore.current.reporter?.name || 'unknown' }}</span>
            <span v-if="issuesStore.current.informantName">
              <v-icon icon="mdi-account-voice" size="14" class="mr-1" />Informed by {{ issuesStore.current.informantName }}
            </span>
            <span v-if="issuesStore.current.startDate">
              <v-icon icon="mdi-calendar-start-outline" size="14" class="mr-1" />
              Start {{ new Date(issuesStore.current.startDate).toLocaleDateString('id-ID') }}
            </span>
            <span v-if="issuesStore.current.dueDate" :class="{ 'text-error font-weight-medium': isOverdue }">
              <v-icon icon="mdi-calendar-end-outline" size="14" class="mr-1" />
              Due {{ new Date(issuesStore.current.dueDate).toLocaleDateString('id-ID') }}
              <span v-if="isOverdue">(overdue)</span>
            </span>
          </v-card-text>
        </v-card>

        <v-card variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-wrench-outline" class="mr-2" size="20" />
            Status &amp; Solution
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-select v-model="statusForm.status" :items="statusOptions" label="Status" />
            <v-textarea
              v-model="statusForm.solution"
              label="Solution / resolution notes"
              rows="4"
              placeholder="Describe how this issue was (or will be) resolved..."
            />
            <v-file-input
              v-model="statusFiles"
              label="Evidence (screenshots, logs, dll.)"
              prepend-icon="mdi-paperclip"
              multiple
              chips
              show-size
              density="comfortable"
            />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="flat" :loading="saving" @click="saveStatus">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="mb-4" variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-account-arrow-right-outline" class="mr-2" size="20" />
            Assignment
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div v-if="issuesStore.current.assignee" class="d-flex align-center mb-4">
              <UserAvatar :name="issuesStore.current.assignee.name" :size="36" class="mr-3" />
              <div>
                <div class="font-weight-medium">{{ issuesStore.current.assignee.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ issuesStore.current.assignee.email }}</div>
              </div>
            </div>
            <v-select
              v-model="assigneeId"
              :items="usersStore.items"
              item-title="name"
              item-value="id"
              label="Assigned programmer"
              prepend-inner-icon="mdi-account-outline"
              clearable
            />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="flat" :loading="assigning" @click="saveAssignee">Save Assignment</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mb-4" variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-calendar-range-outline" class="mr-2" size="20" />
            Timeline
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-text-field
              v-model="startDate"
              type="date"
              label="Start date"
              prepend-inner-icon="mdi-calendar-start-outline"
              clearable
              class="mb-2"
            />
            <v-text-field
              v-model="dueDate"
              type="date"
              label="Due date"
              prepend-inner-icon="mdi-calendar-end-outline"
              clearable
            />
            <p v-if="startDate && dueDate && startDate > dueDate" class="text-caption text-warning mt-1">
              <v-icon icon="mdi-alert-outline" size="14" class="mr-1" />Start date is after due date
            </p>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="flat" :loading="savingDates" @click="saveDates">Save Timeline</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mb-4" variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-tag-outline" class="mr-2" size="20" />
            Kategori
          </v-card-title>
          <v-divider />
          <v-card-text>
            <LabelPicker v-model="labelIds" />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="flat" :loading="savingLabels" @click="saveLabels">Save Kategori</v-btn>
          </v-card-actions>
        </v-card>

        <v-card variant="flat" border>
          <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-timeline-text-outline" class="mr-2" size="20" />
            Activity
          </v-card-title>
          <v-divider />
          <v-card-text>
            <IssueActivityTimeline ref="activityTimeline" :issue-id="Number(id)" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
