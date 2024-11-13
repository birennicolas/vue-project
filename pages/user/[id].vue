<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserDialog from "~/components/UserDialog.vue";
import { userService } from "../../services/api/users";
import type { User, Post, Comment } from "../../services/api/users";

interface PostWithComments extends Post {
  commentsCount: number;
}

const route = useRoute();
const userId = route.params.id as string;
const userData = ref<User | null>(null);
const userPosts = ref<PostWithComments[]>([]);
const search = ref("");
const selectedComments = ref<Comment[]>([]);
const isDialogOpen = ref(false);
const loading = ref(true);

const router = useRouter();

const fetchUserData = async () => {
  try {
    loading.value = true;
    userData.value = await userService.getUser(userId);
  } finally {
    loading.value = false;
  }
};

const fetchUserPosts = async () => {
  try {
    loading.value = true;
    const posts = await userService.getUserPosts(userId);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await userService.getPostComments(post.id);
        return {
          ...post,
          commentsCount: comments.length,
        };
      })
    );

    userPosts.value = postsWithComments;
  } finally {
    loading.value = false;
  }
};

const fetchPostComments = async (postId: number): Promise<Comment[]> => {
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

const showComments = async (postId: number) => {
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
});
</script>

<template>
  <div class="userposts-background">
    <div class="header-container">
      <v-btn class="ma-4" prepend-icon="mdi-arrow-left" @click="goBack">
        Go back
      </v-btn>
      <v-text-field
        v-model="search"
        label="Search Posts"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        width="90%"
        max-width="1250"
        hide-details
        single-line
        class="search-field"
      ></v-text-field>
    </div>
    <UserDialog
      :max-width="800"
      :comments="selectedComments"
      v-model:isOpen="isDialogOpen"
    />
    <v-card
      class="mx-auto my-4 d-flex flex-column align-center justify-center"
      elevation="16"
      width="90%"
      height="90%"
      max-width="1250"
      max-height="600"
      rounded="lg"
      flat
    >
      <div>
        <div class="d-flex align-center justify-center my-4">
          <template v-if="!loading">
            <v-avatar color="red" size="60">
              <span class="text-h5">{{ userInitials }}</span>
            </v-avatar>
            <v-card-title>{{ userData?.name }}'s posts</v-card-title>
          </template>
          <template v-else>
            <v-skeleton-loader
              type="avatar"
              size="60"
              class="ma-2"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="text"
              width="200"
              class="ma-2"
            ></v-skeleton-loader>
          </template>
        </div>
      </div>

      <div class="table-container">
        <v-data-table
          :items="userPosts"
          :search="search"
          :loading="loading"
          fixed-header
          class="bold-headers"
          :headers="[
            { title: 'Title', key: 'title' },
            { title: 'Body', key: 'body' },
            {
              title: 'Comments',
              key: 'commentsCount',
              align: 'center',
              sortable: true,
            },
          ]"
        >
          <template v-slot:loading>
            <v-skeleton-loader
              v-for="n in 5"
              :key="n"
              type="table-row"
              class="pa-4"
            ></v-skeleton-loader>
          </template>

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
@import "@/assets/styles/main.css";
@import "@/assets/styles/UserPosts.css";
</style>
