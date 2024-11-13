<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userService } from "~/services/api/users";

const router = useRouter();
const users = ref([]);
const search = ref("");

const fetchUsers = async () => {
  users.value = await userService.getUsers();
};

const handleUserClick = (item) => {
  router.push(`/user/${item.id}`);
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="userslist-background">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          width="95%"
          max-width="1250"
          hide-details
          single-line
          class="search-field"
        ></v-text-field>

    <v-card
      class="mx-auto my-8"
      elevation="16"
      width="95%"
      height="90%"
      max-width="1250"
      max-height="700"
      rounded="lg"
      style="overflow: auto"
    >
      <v-data-table
        :items="users"
        :search="search"
        height="500px"
        fixed-header
        class="bold-headers"
      >
        <template v-slot:item="{ item }">
          <tr @click="handleUserClick(item)" class="table-row">
            <td v-for="(value, key) in item" :key="key">
              {{
                key === "company"
                  ? value.name
                  : key === "address"
                  ? `${value.street}\n${value.suite}\n${value.city}, ${value.zipcode}`
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
@import "@/assets/styles/UserList.css";

.search-field {
  background-color: white;
  margin-top: 16px;
}

.bold-headers th {
  font-weight: bold !important;
  background-color: #8d8989 !important; /* dark grey background */
  color: white !important;
}
</style>
