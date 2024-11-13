<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id
const userData = ref(null)
const userPosts = ref([])
const search = ref('')

const fetchUserData = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  userData.value = await response.json()
}

const fetchUserPosts = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
  userPosts.value = await response.json()
  console.log("this is the user posts >>>", userPosts.value)
}

onMounted(() => {
  fetchUserData()
  fetchUserPosts()
})
</script>

<template>
  <v-card v-if="userData" flat>
    <v-card-title>
      User Details: {{ userData.name }}
    </v-card-title>
    
    <v-card-text>
      <p><strong>Email:</strong> {{ userData.email }}</p>
      <p><strong>Phone:</strong> {{ userData.phone }}</p>
      <p><strong>Website:</strong> {{ userData.website }}</p>
    </v-card-text>

    <v-card-title>User Posts</v-card-title>
    
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
        { title: 'Body', key: 'body' }
      ]"
    ></v-data-table>
  </v-card>
</template>