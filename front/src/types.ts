export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    role: Role;
    content: string;
    createdAt: string;
    fromHistory?: boolean;
}

export interface ChatRequestDto {
    id: number;
    ip_address: string;
    prompt: string;
    response: string;
}
