import { supabase } from "./supabase";


export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    // Get Supabase session (includes JWT)
    try {

        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
            throw new Error("Failed to get auth session");
        }

        const token = session?.access_token;

        //const url = `${API_BASE_URL}${path}`;
        const url = path;
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });


        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message ?? `API error ${res.status}`);
        }

        return res.json();

    } catch (err) {
        console.log("Error:: " + err);
        throw new Error(err as string);
    }
}
