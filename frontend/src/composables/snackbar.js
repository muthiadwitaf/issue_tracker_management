import { reactive } from 'vue';

const state = reactive({
  show: false,
  text: '',
  color: 'success',
});

export function notify(text, color = 'success') {
  state.text = text;
  state.color = color;
  state.show = true;
}

export function useSnackbarState() {
  return state;
}
