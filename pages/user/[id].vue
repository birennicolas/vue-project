<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserDialog from '~/components/UserDialog.vue';

const route = useRoute();
const userId = route.params.id;
const userData = ref(null);
const userPosts = ref([]);
const search = ref("");
const selectedComments = ref([]);
const isDialogOpen = ref(false);

const router = useRouter();

const fetchUserData = async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  userData.value = await response.json();
};

const fetchUserPosts = async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  );
  const posts = await response.json();
  
  // Fetch comments for each post
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await fetchPostComments(post.id);
      return {
        ...post,
        commentsCount: comments.length
      };
    })
  );
  console.log("this is the posts with comments >>>", postsWithComments);
  
  userPosts.value = postsWithComments;
};

const fetchPostComments = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  return await response.json();
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
  console.log("this is the comments >>>", comments);
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
  <div class="gradient-background">
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
      width="1250"
      height="700"
      rounded="lg"
      style="overflow: auto"
      v-if="userData"
      flat
    >
      <div class="d-flex align-center justify-center">
        <v-avatar color="red" size="50">
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
        class="mx-4"
      ></v-text-field>

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
    </v-card>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
