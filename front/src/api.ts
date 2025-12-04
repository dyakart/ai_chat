import type {ChatRequestDto} from './types';

const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
    'http://localhost:8000';

async function handleJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(
            `API error ${res.status}: ${text || res.statusText || 'Unknown error'}`
        );
    }
    return (await res.json()) as T;
}

export async function fetchGeminiHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/health_gemini`, {method: 'GET'});

        if (!res.ok) return false;

        const data = (await res.json().catch(() => null)) as { status?: string } | null;
        return data?.status === 'ok';
    } catch {
        return false;
    }
}

export async function fetchHistory(): Promise<ChatRequestDto[]> {
    const res = await fetch(`${API_BASE_URL}/get_user_requests`);
    return handleJson<ChatRequestDto[]>(res);
}

export async function sendPrompt(prompt: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/get_answer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt}),
    });

    const data = await handleJson<{ answer: string }>(res);
    return data.answer;
}
