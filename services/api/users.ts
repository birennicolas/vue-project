export interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    return await response.json();
  },

  async getUser(userId: string | number): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    return await response.json();
  },

  async getUserPosts(userId: string | number): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
    return await response.json();
  },

  async getPostComments(postId: number): Promise<Comment[]> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    return await response.json();
  }
}; 