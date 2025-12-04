import { useEffect, useState } from 'react';
import { fetchGeminiHealth, fetchHistory, sendPrompt } from '../api';
import type { ChatMessage, ChatRequestDto } from '../types';

function mapHistoryToMessages(history: ChatRequestDto[]): ChatMessage[] {
    return history.flatMap((item) => [
        {
            id: `${item.id}-user`,
            role: 'user' as const,
            content: item.prompt,
            createdAt: new Date().toISOString(),
            fromHistory: true,
        },
        {
            id: `${item.id}-assistant`,
            role: 'assistant' as const,
            content: item.response,
            createdAt: new Date().toISOString(),
            fromHistory: true,
        },
    ]);
}

const initialMessages: ChatMessage[] = [
    {
        id: 'system-welcome',
        role: 'system',
        content: 'Привет! Я Gemini. Задай вопрос — я постараюсь ответить 😊',
        createdAt: new Date().toISOString(),
    },
];

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [gemini, history] = await Promise.allSettled([
                    fetchGeminiHealth(),
                    fetchHistory(),
                ]);

                let online: boolean;

                if (gemini.status === 'fulfilled') {
                    online = gemini.value;
                    console.log('gemini health:', gemini.value);
                } else {
                    online = false;
                }

                if (history.status === 'fulfilled') {
                    const historyMessages = mapHistoryToMessages(history.value);
                    setMessages([...initialMessages, ...historyMessages]);
                }

                setIsOnline(online);
            } catch (e) {
                console.error(e);
                setError('Не удалось загрузить историю.');
                setIsOnline(false);
            } finally {
                setIsHistoryLoading(false);
            }
        })();
    }, []);

    async function sendMessage(content: string) {
        if (!content.trim() || isLoading) return;

        setError(null);
        const userMsg: ChatMessage = {
            id: `local-${Date.now()}-user`,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const answer = await sendPrompt(content);
            const botMsg: ChatMessage = {
                id: `local-${Date.now()}-assistant`,
                role: 'assistant',
                content: answer ?? '',
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsOnline(true);
        } catch (e: any) {
            console.error(e);
            const errMsg: ChatMessage = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content:
                    'Произошла ошибка при запросе к серверу. Пожалуйста попробуйте повторить запрос позже..',
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errMsg]);
            setIsOnline(false);
        } finally {
            setIsLoading(false);
        }
    }

    function clearChat() {
        setMessages((prev) => prev.filter((m) => m.role === 'system'));
    }

    return {
        messages,
        isLoading,
        isHistoryLoading,
        error,
        isOnline,
        sendMessage,
        clearChat,
    };
}
