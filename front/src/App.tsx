import React from 'react';
import { useChat } from './hooks/useChat';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import TopBar from './components/TopBar';

const App: React.FC = () => {
    const {
        messages,
        isLoading,
        isHistoryLoading,
        isOnline,
        sendMessage,
        clearChat,
    } = useChat();

    return (
        <div className="min-h-screen flex flex-col bg-chat-bg">
            <TopBar isOnline={isOnline} onClear={clearChat} />

            <main className="flex-1 flex justify-center">
                <div className="flex flex-col w-full max-w-4xl border-x border-chat-border bg-gradient-to-b from-[#09090f] to-chat-bg/80">

                    {isHistoryLoading && (
                        <div className="mx-4 mt-4 rounded-xl border border-chat-border bg-chat-panel px-3 py-2 text-xs text-gray-400">
                            Загружаю историю запросов…
                        </div>
                    )}

                    <MessageList messages={messages} isLoading={isLoading} />
                    <ChatInput
                        disabled={isLoading || isOnline === false}
                        onSend={sendMessage}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
