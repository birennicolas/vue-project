<script setup lang="ts">
interface Comment {
  name: string;
  email: string;
  body: string;
}

interface Props {
  maxWidth?: number;
  comments: Comment[];
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>();

const closeDialog = () => {
  emit('update:isOpen', false);
};
</script>

<template>
  <v-dialog :model-value="isOpen" @update:model-value="closeDialog" :max-width="900" width="100%">
    <v-card title="Post comments">
      <v-data-table
        :items="comments"
        class="bold-headers"
        :headers="[
          { title: 'Name', key: 'name' },
          { title: 'Email', key: 'email' },
          { title: 'Comment', key: 'body' }
        ]"
        style="width: 95%; margin: auto;"
      ></v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text="Close"
          @click="closeDialog"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template> 