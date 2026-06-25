import { authClient } from "@/lib/auth-client";

const getToken = async (retries = 3, delay = 300) => {
    for (let i = 0; i < retries; i++) {
        const { data: session } = await authClient.getSession();
        if (!session) return '';
        const { data: tokenObj } = await authClient.token();
        const token = tokenObj?.token || '';
        if (token) return token;
        // Token not ready yet — wait and retry
        if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
    }
    return '';
};

export const apiFetch = async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
};
