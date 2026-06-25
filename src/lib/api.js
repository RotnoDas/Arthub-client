import { authClient } from "@/lib/auth-client";

export const apiFetch = async (url, options = {}) => {
    const { data: session } = await authClient.getSession();
    let token = '';
    if (session) {
        const { data: tokenObj } = await authClient.token();
        token = tokenObj?.token || '';
    }
    
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
};
