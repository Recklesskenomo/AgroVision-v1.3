import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Token management
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

class AuthService {
    async register(username, email, password) {
        try {
            console.log('Sending registration request:', { username, email });
            const response = await axios.post(`${API_URL}/register`, {
                username,
                email,
                password
            }, {
                withCredentials: true
            });
            
            console.log('Registration successful:', response.data);
            const { accessToken } = response.data;
            
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                setAuthToken(accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }

    async login(email, password) {
        try {
            console.log('Sending login request:', { email });
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            
            console.log('Login successful:', response.data);
            const { accessToken } = response.data;
            
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                setAuthToken(accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }

    async refreshToken() {
        try {
            const response = await axios.post(`${API_URL}/refresh-token`, {}, {
                withCredentials: true
            });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            setAuthToken(accessToken);
            return accessToken;
        } catch (error) {
            this.logout();
            console.error('Token refresh error:', error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }

    async logout() {
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                withCredentials: true
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setAuthToken(null);
        } catch (error) {
            console.error('Logout error:', error.response?.data || error.message);
        } finally {
            // Always clear local storage even if API request fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setAuthToken(null);
        }
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

export const authService = new AuthService(); 