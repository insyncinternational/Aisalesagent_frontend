import { User } from '../types';

export interface AuthResponse {
  message: string;
  user?: Omit<User, 'passwordHash'>;
}

export interface AuthError {
  message: string;
  errors?: string[];
}

class AuthService {
  private baseUrl = `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://api.sparkai.ae' : 'http://localhost:8000')}/api/auth`;

  async register(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo login for development/testing
    if (email === 'admin@example.com' && password === 'admin123') {
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        name: 'Demo User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store demo user in localStorage for demo purposes
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      
      return {
        message: 'Demo login successful',
        user: demoUser,
      };
    }

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  async logout(): Promise<void> {
    // Clear demo user if exists
    localStorage.removeItem('demo-user');
    
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  async getProfile(): Promise<Omit<User, 'passwordHash'> | null> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      credentials: 'include',
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(email: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Profile update failed');
    }

    return data;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password change failed');
    }
  }

  async checkStatus(): Promise<{ authenticated: boolean; user?: Omit<User, 'passwordHash'> }> {
    // Check for demo user first
    const demoUser = localStorage.getItem('demo-user');
    if (demoUser) {
      try {
        const user = JSON.parse(demoUser);
        return { authenticated: true, user };
      } catch (error) {
        localStorage.removeItem('demo-user');
      }
    }

    const response = await fetch(`${this.baseUrl}/status`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    return await response.json();
  }
}

export const authService = new AuthService(); 