import HttpStatusError from '../errors/HttpStatusError';
import { Post, Comment } from '../types';

enum RequestVariant {
  post = 'POST',
  get = 'GET',
  put = 'PUT',
  delete = 'DELETE',
}

export class ApiClient {
  private baseUrl: string;
  private config?: RequestInit;

  constructor(baseUrl?: string, config = {}) {
    this.baseUrl = baseUrl ?? 'https://jsonplaceholder.typicode.com';
    this.config = config;
  }

  private async request<T>(url: string, method: string, body?: T): Promise<T> {
    let status = NaN;
    let msg = '';
    try{
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...this.config,
        body: body ? JSON.stringify(body) : undefined,
      });
      status = response.status;
      msg = response.statusText;
      const data = await response.json();
      return data;
    }catch(e){
      throw new HttpStatusError(status, msg);
    }
  }

  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts', RequestVariant.get);
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, RequestVariant.get);
  }

  async getPostComments(id: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${id}/comments`, RequestVariant.get);
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments?postId=${postId}`, RequestVariant.get);
  }

  async createPost(post: Post): Promise<Post> {
    return this.request<Post>('/posts', RequestVariant.post, post);
  }

  async updatePost(id: number, post: Post): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, RequestVariant.put, post);
  }

  async deletePost(id: number): Promise<void> {
    await this.request<void>(`/posts/${id}`, RequestVariant.delete);
  }
}
