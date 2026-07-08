<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref({ name: '', email: '', password: '' });

watch(
  () => [props.modelValue, props.user],
  ([open]) => {
    if (open) {
      form.value = props.user
        ? { name: props.user.name, email: props.user.email, password: '' }
        : { name: '', email: '', password: '' };
    }
  },
);

function close() {
  emit('update:modelValue', false);
}

function save() {
  const payload = { name: form.value.name, email: form.value.email };
  if (form.value.password) payload.password = form.value.password;
  emit('save', payload);
  close();
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="450" @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>{{ user ? 'Edit User' : 'New User' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.name" label="Name" autofocus />
        <v-text-field v-model="form.email" label="Email" type="email" />
        <v-text-field
          v-model="form.password"
          label="Password"
          type="password"
          :placeholder="user ? 'Kosongkan jika tidak ingin ganti' : ''"
          :hint="user ? 'Kosongkan jika tidak ingin ganti password' : 'Wajib diisi untuk akun baru'"
          persistent-hint
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!form.name || !form.email || (!user && !form.password)"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
