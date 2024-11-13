<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserDialog from '~/components/UserDialog.vue';
import { userService } from '~/services/api/users';

const route = useRoute();
const userId = route.params.id;
const userData = ref(null);
const userPosts = ref([]);
const search = ref("");
const selectedComments = ref([]);
const isDialogOpen = ref(false);

const router = useRouter();

const fetchUserData = async () => {
  userData.value = await userService.getUser(userId);
};

const fetchUserPosts = async () => {
  const posts = await userService.getUserPosts(userId);
  
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await userService.getPostComments(post.id);
      return {
        ...post,
        commentsCount: comments.length
      };
    })
  );
  
  userPosts.value = postsWithComments;
};

const fetchPostComments = async (postId) => {
  return await userService.getPostComments(postId);
};

const userInitials = computed(() => {
  if (!userData.value?.name) return "";
  return userData.value.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

const showComments = async (postId) => {
  const comments = await fetchPostComments(postId);
  selectedComments.value = comments;
  isDialogOpen.value = true;
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchUserData();
  fetchUserPosts();
  fetchPostComments();
});
</script>

<template>
  <div class="userposts-background">
    <v-btn
      class="ma-4"
      prepend-icon="mdi-arrow-left"
      @click="goBack"
    >
      Go back
    </v-btn>
    <UserDialog 
      :max-width="800"
      :comments="selectedComments"
      v-model:isOpen="isDialogOpen"
    />
    <v-card
      class="mx-auto my-4"
      elevation="16"
      width="90%"
      height="90%"
      maxwidth="1250"
      max-height="600"
      rounded="lg"
      v-if="userData"
      flat
    >
      <div class="fixed-content">
        <div class="d-flex align-center justify-center my-4">
          <v-avatar color="red" size="60">
            <span class="text-h5">{{ userInitials }}</span>
          </v-avatar>
          <v-card-title> {{ userData.name }}'s posts</v-card-title>
        </div>

        <v-text-field
          v-model="search"
          label="Search Posts"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="mx-4 mb-4"
        ></v-text-field>
      </div>

      <div class="table-container">
        <v-data-table
          :items="userPosts"
          :search="search"
          :headers="[
            { title: 'Title', key: 'title' },
            { title: 'Body', key: 'body' },
            { 
              title: 'Comments',
              key: 'commentsCount',
              align: 'center',
              sortable: true
            },
          ]"
        >
          <template v-slot:item.commentsCount="{ item }">
            <v-chip
              color="primary"
              class="cursor-pointer"
              @click="showComments(item.id)"
            >
              {{ item.commentsCount }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<style>
@import '@/assets/styles/UserPosts.css';
</style>
