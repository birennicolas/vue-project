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
    width="1250"
    height="700"
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
        <tr @click="handleUserClick(item)" class="table-row">
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
.table-row {
  cursor: pointer;
}
.table-row:hover {
  background-color: #f5f5f5;  /* Light grey */
}
.gradient-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
  height: 100vh;
  background: linear-gradient(145deg, #f0f0f0 0%, #d4d4d4 100%);
}
</style>