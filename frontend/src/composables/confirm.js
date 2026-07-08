import { reactive } from 'vue';

const state = reactive({
  show: false,
  title: 'Confirm',
  message: '',
  confirmText: 'Delete',
  color: 'error',
  resolve: null,
});

export function confirmDialog({ title = 'Confirm', message, confirmText = 'Delete', color = 'error' }) {
  state.title = title;
  state.message = message;
  state.confirmText = confirmText;
  state.color = color;
  state.show = true;
  return new Promise((resolve) => {
    state.resolve = resolve;
  });
}

export function useConfirmState() {
  return state;
}
