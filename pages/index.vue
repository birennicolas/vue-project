<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const search = ref('')

const fetchPosts = async () => { 
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  users.value = await response.json()
  console.log(users.value);
} 

const handleUserClick = (item) => {
    console.log("this is the item >>>", item)
  router.push(`/user/${item.id}`)
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
    <div class="gradient-background">
  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="1250"
    max-height="700"
    rounded="lg"
    style="overflow: auto"
  >
  <div class="pa-4">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </div>

    <v-data-table
      :items="users"
      :search="search"
      height="500px"
      fixed-header
    >
      <template v-slot:item="{ item }">
        <tr @click="handleUserClick(item)" style="cursor: pointer">
          <td v-for="(value, key) in item" :key="key">
            {{ value }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</div>
</template>

<style scoped>
.gradient-background {
  min-height: 100vh;
  background: linear-gradient(145deg, #f0f0f0 0%, #d4d4d4 100%);
  padding: 20px;
}
</style>