<script setup>
defineProps({
  maxWidth: {
    type: Number,
    default: 800
  },
  comments: {
    type: Array,
    default: () => []
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isOpen']);

const closeDialog = () => {
  emit('update:isOpen', false);
};
</script>

<template>
  <v-dialog :model-value="isOpen" @update:model-value="closeDialog" :max-width="maxWidth">
    <v-card title="Post comments">
      <v-data-table
        :items="comments"
        :headers="[
          { title: 'Name', key: 'name' },
          { title: 'Email', key: 'email' },
          { title: 'Comment', key: 'body' }
        ]"
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