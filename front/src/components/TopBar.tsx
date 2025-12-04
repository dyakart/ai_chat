import React from 'react';

interface Props {
    isOnline: boolean | null;
    onClear: () => void;
}

const TopBar: React.FC<Props> = ({ isOnline, onClear }) => {
    return (
        <header className="border-b border-chat-border bg-chat-bg/80 backdrop-blur sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-xs font-bold">
                        AI
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Gemini AI Chat</span>
                        <span className="text-[11px] text-gray-500">
                          Найдется всё 😏
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
          <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]
                ${
                  isOnline
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/40 bg-red-500/10 text-red-300'
                }`}
          >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-400' : 'bg-red-400'
                }`}
            ></span>
              {isOnline === null
                  ? 'Пытаюсь установить соединение…'
                  : isOnline
                      ? 'online'
                      : 'offline'}
          </span>

                    <button
                        type="button"
                        onClick={onClear}
                        className="text-[11px] px-3 py-1.5 rounded-full border border-chat-border text-gray-300 cursor-pointer hover:border-red-500/60 hover:text-red-300 transition-colors"
                    >
                        Очистить чат
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
