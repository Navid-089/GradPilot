// const API_BASE_URL = "http://localhost:8085";
const API_BASE_URL = "https://gradpilot.me"; // Uncomment this for production

class ForumService {
  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Create headers with auth token
  getHeaders(isFormData = false) {
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Get all posts with pagination and filtering
  async getPosts(page = 0, size = 10, tag = null, title = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (tag) params.append("tag", tag);
      if (title) params.append("title", title);

      const response = await fetch(
        `${API_BASE_URL}/api/forum/posts?${params}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  // Get single post with comments
  async getPost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  }

  // Create a new post
  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  // Add comment to post
  async addComment(postId, commentData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum/posts/${postId}/comments`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  // Like/dislike a post
  async togglePostLike(postId, isLike) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum/posts/${postId}/like`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ isLike }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error toggling post like:", error);
      throw error;
    }
  }

  // Like/dislike a comment
  async toggleCommentLike(commentId, isLike) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum/comments/${commentId}/like`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ isLike }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  }

  // Get all available tags
  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forum/tags`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/forum/upload`, {
        method: "POST",
        headers: this.getHeaders(true), // Don't set Content-Type for FormData
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum/posts/${postId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum/comments/${commentId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
}

const forumService = new ForumService();
export default forumService;
