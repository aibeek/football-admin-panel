import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import type { LoginResponse } from '../types/auth';
import { apiService } from '../utils/apiService';
import { ErrorHandler } from '../utils/errorHandler';
import { showToast } from '../utils/toast';

interface AuthState {
    user: LoginResponse | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    login: (phone: string, password: string) => Promise<boolean>;
    loginAsGuest: () => void;
    register: (firstname: string, lastname: string, phone: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => {
            // Проверяем при инициализации, если это гостевая сессия
            const isGuestSession = typeof window !== 'undefined' && localStorage.getItem('is_guest') === 'true';
            
            return {
                user: null,
                isLoading: false,
                error: null,
                isAuthenticated: isGuestSession ? true : false,
                isGuest: isGuestSession,

                login: async (phone, password) => {
                    set({ isLoading: true, error: null });
                    
                    try {
                        const response = await apiService.execute(
                            () => authApi.login({ phone, password }),
                            'login'
                        );
                        
                        set({
                            user: response,
                            isAuthenticated: true,
                            isGuest: false,
                            isLoading: false
                        });
                        
                        localStorage.setItem('auth_token', response.token);
                        showToast('Login successful!', 'success');
                        return true;
                    } 
                    catch (error: any) {
                        const errorMessage = ErrorHandler.handle(error);
                        set({
                            error: errorMessage.message,
                            isLoading: false
                        });
                        
                        return false;
                    }
                },

                loginAsGuest: () => {
                    const guestUser: LoginResponse = {
                        token: 'guest-token-' + Date.now(),
                        firstname: 'Guest',
                        lastname: 'User',
                        phone: '+7 (777) 000 00 00',
                        profilePictureUrl: null,
                        role: ['GUEST']
                    };

                    set({
                        user: guestUser,
                        isAuthenticated: true,
                        isGuest: true,
                        isLoading: false,
                        error: null
                    });

                    localStorage.setItem('auth_token', guestUser.token);
                    localStorage.setItem('is_guest', 'true');
                    showToast('Вы вошли как гость. Доступен только просмотр данных.', 'info');
                },

                register: async (firstname, lastname, phone, password) => {
                    set({ isLoading: true, error: null });
                    
                    try {
                        await apiService.execute(
                            () => authApi.register({ firstname, lastname, phone, password }),
                            'register'
                        );
                        set({ isLoading: false });
                        
                        showToast('Registration successful! Please login.', 'success');
                        return true;
                    } 
                    catch (error: any) {
                        const errorMessage = ErrorHandler.handle(error);
                        set({
                            error: errorMessage.message,
                            isLoading: false
                        });
                        
                        return false;
                    }
                },

                logout: () => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('is_guest');
                    apiService.clearCache(); // Clear API cache on logout
                    set({ user: null, isAuthenticated: false, isGuest: false });
                    showToast('Logged out successfully', 'info');
                    // Note: Navigation should be handled by React Router in the component
                }
            };
        },
        {
            name: 'auth-storage',
        }
    )
);
