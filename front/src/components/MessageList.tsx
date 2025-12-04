import React, { useEffect, useState } from 'react';
import type { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';

interface Props {
    messages: ChatMessage[];
    isLoading: boolean;
}

const MessageList: React.FC<Props> = ({ messages, isLoading }) => {
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    // Автоскролл вниз при новых сообщениях
    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'auto',
        });
        setShowScrollToBottom(false);
    }, [messages.length, isLoading]);

    // Следим за скроллом окна
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            const isAtBottom = fullHeight <= scrollY + viewportHeight + 1;
            setShowScrollToBottom(!isAtBottom);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
        setShowScrollToBottom(false);
    };

    return (
        <>
            <div className="flex-1 px-4 py-4 space-y-1">
                {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                ))}

                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="flex items-center gap-3 max-w-xs bg-chat-panel border border-chat-border px-3 py-2 rounded-2xl text-sm text-gray-300">
                            <LoadingDots />
                            <span className="text-xs text-gray-400">Думаю…</span>
                        </div>
                    </div>
                )}
            </div>

            {showScrollToBottom && (
                <button
                    type="button"
                    onClick={scrollToBottom}
                    className="fixed left-1/2 -translate-x-1/2 bottom-24 z-30
                               rounded-full border border-chat-border bg-chat-panel/90 shadow-lg
                               hover:border-emerald-500/60 hover:text-emerald-300
                               transition-colors p-2 text-gray-300 cursor-pointer"
                    aria-label="Прокрутить вниз"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5A1 1 0 114.707 10.293L8 13.586V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default MessageList;
