import axios from 'axios';

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
            const response = await axios.post('/auth/register', {
                username,
                email,
                password
            });
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Auth service register error:', error.response || error);
            throw error;
        }
    }

    async login(email, password) {
        const response = await axios.post('/auth/login', {
            email,
            password
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        setAuthToken(accessToken);
        return response.data;
    }

    async refreshToken() {
        try {
            const response = await axios.post('/auth/refresh-token');
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            setAuthToken(accessToken);
            return accessToken;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('accessToken');
        setAuthToken(null);
    }

    getCurrentUser() {
        const token = localStorage.getItem('accessToken');
        return token ? JSON.parse(atob(token.split('.')[1])) : null;
    }
}

export const authService = new AuthService(); 