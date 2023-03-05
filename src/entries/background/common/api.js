export default async function api(url, options) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${url}`, {
        headers: {
            Accept: 'application/json',
            ...options?.headers || {},
            ...options?.token ? {
                Authorization: `Bearer ${options.token}`,
            } : {},
            ...options?.json ? {
                'Content-Type': 'application/json',
            } : {},
        },
        ...options || {},
        ...options?.json ? {
            body: JSON.stringify(options.json),
        } : {},
    });

    return {
        status: response.status,
        data: await response.json(),
    };
}
