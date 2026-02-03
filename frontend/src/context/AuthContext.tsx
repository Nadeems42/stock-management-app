import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface User {
    _id: number;
    name: string;
    email: string;
    role: 'owner' | 'staff';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Ideally verify token with backend here, for now trust local storage
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }));
        setUser({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
