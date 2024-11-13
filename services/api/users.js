const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userService = {
  async getUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    return await response.json();
  },

  async getUser(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    return await response.json();
  },

  async getUserPosts(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
    return await response.json();
  },

  async getPostComments(postId) {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    return await response.json();
  }
}; 