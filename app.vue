<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])

const fetchPosts = async () => { 
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  users.value = await response.json()
  console.log(users.value);
} 

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <v-app>
    <v-table density="compact"
    fixed-header>
      <thead>
        <tr>
          <th class="text-left">User ID</th>
          <th class="text-left">ID</th>
          <th class="text-left">username</th>
          <th class="text-left">email</th>
          <th class="text-left">website</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.website }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-app>
</template>
