import { drizzle } from "drizzle-orm/expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/services/db/schemas";

interface User {
    id: string;
    name: string;
    email: string;
    currency: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (user: User) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const db = useSQLiteContext();
    const drizzleDB = drizzle(db, { schema });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            // Query the first user from the database
            const users = await drizzleDB.select().from(schema.users).limit(1);
            if (users.length > 0) {
                setUser(users[0]);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (userData: User) => {
        setUser(userData);
    };

    const signOut = async () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signOut,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
