import { createContext, useContext } from 'react';
import { useAuthStore } from '../store/auth.store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const authStore = useAuthStore();
    return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
