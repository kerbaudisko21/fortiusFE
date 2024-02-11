import { createContext, useEffect, useReducer, ReactNode } from 'react';

interface User {
    user: any;
    username: string,
    email: string,
    password: string
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface Action {
    type: string;
    payload?: any;
}

const INITIAL_STATE: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    loading: false,
    error: null,
};

export const AuthContext = createContext<{
    state: AuthState;
    loading: boolean;
    error: string | null;
    dispatch: React.Dispatch<Action>;
}>({
    state: INITIAL_STATE,
    loading: false,
    error: null,
    dispatch: () => null,
});

const AuthReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'REGIS_START':
        case 'LOGIN_START':
            return {
                user: null,
                loading: true,
                error: null,
            };
        case 'REGIS_SUCCESS':
            return {
                user: null,
                loading: false,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'REGIS_FAILURE':
        case 'LOGIN_FAILURE':
            return {
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                user: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ state, loading: state.loading, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
