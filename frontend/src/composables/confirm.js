import { reactive } from 'vue';

const state = reactive({
  show: false,
  title: 'Konfirmasi',
  message: '',
  confirmText: 'Hapus',
  color: 'error',
  resolve: null,
});

export function confirmDialog({ title = 'Konfirmasi', message, confirmText = 'Hapus', color = 'error' }) {
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
