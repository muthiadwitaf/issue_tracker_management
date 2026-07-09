export const STATUS_OPTIONS = [
  { value: 'OPEN', title: 'Terbuka', icon: 'mdi-alert-circle-outline', color: 'statusOpen' },
  { value: 'IN_PROGRESS', title: 'Dikerjakan', icon: 'mdi-progress-clock', color: 'statusInProgress' },
  { value: 'RESOLVED', title: 'Selesai', icon: 'mdi-check-circle-outline', color: 'statusResolved' },
  { value: 'TESTING', title: 'Pengujian', icon: 'mdi-flask-outline', color: 'statusTesting' },
  { value: 'DEPLOY', title: 'Rilis', icon: 'mdi-rocket-launch-outline', color: 'statusDeploy' },
  { value: 'TESTED', title: 'Teruji', icon: 'mdi-check-decagram-outline', color: 'statusTested' },
  { value: 'REVIEWED', title: 'Ditinjau', icon: 'mdi-eye-check-outline', color: 'statusReviewed' },
  { value: 'CLOSED', title: 'Ditutup', icon: 'mdi-archive-outline', color: 'statusClosed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', title: 'Rendah', icon: 'mdi-chevron-down', color: 'priorityLow' },
  { value: 'MEDIUM', title: 'Sedang', icon: 'mdi-equal', color: 'priorityMedium' },
  { value: 'HIGH', title: 'Tinggi', icon: 'mdi-chevron-up', color: 'priorityHigh' },
  { value: 'CRITICAL', title: 'Kritis', icon: 'mdi-chevron-double-up', color: 'priorityCritical' },
];

export const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.title]));
export const PRIORITY_LABELS = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.title]));
