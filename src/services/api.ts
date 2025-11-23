const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

export class ApiService {
  private static getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  static async get<T>(endpoint: string, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(token),
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  static async post<T>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  static async put<T>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  static async patch<T>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(token),
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      } catch (error) {
        // Handle cases where response body is not readable
        if (response.status === 0) {
          throw new Error(
            "CORS Error: Unable to reach the server. Please check if the backend is running and CORS is properly configured."
          );
        }
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    return response.json();
  }
}
