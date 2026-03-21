import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { authValidators, useFormValidation } from '../../utils/validation';
import { formatPhoneDisplay, extractPhoneNumber } from '../../utils/phoneFormatter';

export const LoginForm: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [displayPhone, setDisplayPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, loginAsGuest, isLoading, error } = useAuthStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Use the new validation system
    const { errors, validateField, validateForm, clearErrors } = useFormValidation(
        authValidators.login
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Extract clean phone number for backend
        const cleanPhone = extractPhoneNumber(displayPhone);

        const isValid = validateForm({ phone: cleanPhone, password });
        if (isValid) {
            const success = await login(cleanPhone, password);
            if (success) {
                clearErrors();
                navigate('/dashboard');
            }
        }
    };

    const handlePhoneChange = (value: string) => {
        // Format for display
        const formatted = formatPhoneDisplay(value);
        setDisplayPhone(formatted);

        // Extract clean phone for validation
        const cleanPhone = extractPhoneNumber(formatted);
        setPhone(cleanPhone);

        if (errors.phone) {
            validateField('phone', cleanPhone);
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (errors.password) {
            validateField('password', value);
        }
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate('/dashboard');
    };

    return (
        <div className="space-y-6 transition-opacity duration-300">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gold">{t('auth.loginTitle')}</h1>
                <p className="text-gray-400 mt-2">{t('auth.loginSubtitle')}</p>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500 p-3 rounded-md text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium block" htmlFor="phone">
                        {t('auth.phone')}
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+7 (777) 777 77 77"
                        className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                        value={displayPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={() => validateField('phone', phone)}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium" htmlFor="password">
                            {t('auth.password')}
                        </label>
                        <a href="#" className="text-xs text-gold hover:underline">
                            {t('auth.forgotPassword')}
                        </a>
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onBlur={() => validateField('password', password)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gold transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 3l18 18" />
                                    <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                                    <path d="M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9.27 3.11 11 7-1.01 2.27-2.64 4.18-4.66 5.43" />
                                    <path d="M6.61 6.61C4.62 7.87 3.01 9.76 2 12c1.36 3.06 4.42 5.62 8.1 6.53" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                >
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary mt-2"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-darkest-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('auth.loggingIn')}
                        </span>
                    ) : t('auth.loginButton')}
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-darkest-bg text-gray-400">{t('common.or')}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 
                   transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    👁️ {t('auth.loginAsGuest')}
                </button>
            </form>
        </div>
    );
};
