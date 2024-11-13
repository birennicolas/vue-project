<script setup lang="ts">
import { ref, onMounted } from "vue";
import { userService } from "~/services/api/users";
import type { User } from "~/services/api/users";

const users = ref<User[]>([]);
const search = ref("");
const loading = ref(true);

const fetchUsers = async () => {
  try {
    loading.value = true;
    users.value = await userService.getUsers();
  } finally {
    loading.value = false;
  }
};

const handleUserClick = async (item: User) => {
  await navigateTo(`/user/${item.id}`);
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="userslist-background">
    <div class="search-container">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        width="95%"
        max-width="1250"
        hide-details
        single-line
        class="search-users-field"
      />
    </div>
    <v-card
      class="mx-auto my-8"
      elevation="16"
      width="95%"
      height="90%"
      max-width="1250"
      max-height="700"
      rounded="lg"
      style="overflow: auto; display: flex; flex-direction: column"
    >
      <v-data-table
        :items="users"
        :search="search"
        fixed-header
        class="bold-headers flex-grow-1"
        :loading="loading"
      >
        <template v-slot:loading>
          <v-skeleton-loader
            v-for="n in 10"
            :key="n"
            type="table-row"
            class="pa-4"
          ></v-skeleton-loader>
        </template>

        <template v-slot:item="{ item }">
          <tr @click="handleUserClick(item)" class="table-row">
            <td v-for="(value, key) in item" :key="key">
              {{
                key === "company" &&
                typeof value === "object" &&
                "name" in value
                  ? value.name
                  : key === "address" &&
                    typeof value === "object" &&
                    "street" in value
                  ? `${value.street},\n${value.suite},\n${value.city}, ${value.zipcode}`
                  : value
              }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style>
@import "@/assets/styles/main.css";
@import "@/assets/styles/UserList.css";
</style>
