import React, { useState } from 'react';

interface Props {
    disabled?: boolean;
    onSend: (message: string) => void;
}

const ChatInput: React.FC<Props> = ({ disabled, onSend }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-chat-border bg-chat-bg/80 backdrop-blur sticky bottom-0 px-4 py-3"
        >
            <div className="max-w-3xl mx-auto flex items-end gap-2">
        <textarea
            className="flex-1 resize-none rounded-2xl border border-chat-border bg-chat-panel px-4 py-2.5 text-sm
                     placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent
                     max-h-40"
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши сообщение и нажми Enter (Shift+Enter — новая строка)…"
        />
                <button
                    type="submit"
                    disabled={disabled || !value.trim()}
                    className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/90 px-4 py-2 text-sm font-medium text-white
                     cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
                >
                    Отправить
                </button>
            </div>
            <p className="mt-1 text-[10px] text-gray-500 text-center">
                Gemini 2.5 Flash Lite
            </p>
        </form>
    );
};

export default ChatInput;
