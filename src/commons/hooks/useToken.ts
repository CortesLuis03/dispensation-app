import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const token = sessionStorage.getItem('token');
        return token
    }

    const [token, setToken] = useState<any>(getToken());

    const saveToken = (token: any) => {
        sessionStorage.setItem('token', token)
        setToken(token)
    }

    const removeToken = () => {
        sessionStorage.removeItem('token')
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}