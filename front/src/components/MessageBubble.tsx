import React from 'react';
import type {ChatMessage} from '../types';

interface Props {
    message: ChatMessage;
}

const MessageBubble: React.FC<Props> = ({message}) => {
    if (message.role === 'system') {
        return (
            <div className="flex justify-center my-4">
                <div
                    className="max-w-xl text-center text-xs text-gray-400 bg-chat-panel/70 border border-chat-border px-3 py-2 rounded-full">
                    {message.content}
                </div>
            </div>
        );
    }

    const isUser = message.role === 'user';

    return (
        <div className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`flex max-w-2xl gap-3 ${
                    isUser ? 'flex-row-reverse text-right' : 'flex-row'
                }`}
            >
                <div
                    className={`mt-1 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold
                        ${isUser ? 'bg-emerald-500/80' : 'bg-sky-500/80'}
                    `}
                >
                    {isUser ? 'Ты' : 'AI'}
                </div>

                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border
                    ${
                        isUser
                            ? 'bg-emerald-500/10 border-emerald-500/40'
                            : 'bg-chat-panel border-chat-border'
                    }`}
                >
                    {message.content}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
