import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const SUPABASE_FUNCTION_URL = 'https://htafeakzwjwdjfozpcnm.supabase.co/functions/v1/chat';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ChatBot: React.FC<ChatBotProps> = ({ isOpen: isOpenProp, onToggle }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = isOpenProp ?? localOpen;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: String(Date.now()),
      text: 'Привіт! 👋 Я ваш помічник SkyLink. Як я можу допомогти вам сьогодні?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    const nextOpen = !isOpen;
    if (onToggle) onToggle(nextOpen);
    if (isOpenProp === undefined) setLocalOpen(nextOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'apikey': SUPABASE_ANON,
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Function error', response.status, text);
        throw new Error(`Function returned ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.reply ?? 'Вибачте, сталася помилка.';

      const botMessage: Message = {
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + 1),
        text: replyText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const botMessage: Message = {
        id: String(Date.now() + 2),
        text: 'Вибачте, не вдалося отримати відповідь. Спробуйте пізніше.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3M8.5,14L9.5,12H14.5L15.5,14V15H8.5V14M9,9A1,1 0 0,0 8,10A1,1 0 0,0 9,11A1,1 0 0,0 10,10A1,1 0 0,0 9,9M15,9A1,1 0 0,0 14,10A1,1 0 0,0 15,11A1,1 0 0,0 16,10A1,1 0 0,0 15,9Z"/>
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z"/>
              </svg>
            </div>
            <div className="chatbot-title">
              <h3>SkyLink Support</h3>
              <span>Онлайн • Зазвичай відповідає за 2 хв</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user' : 'bot'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Напишіть ваше повідомлення..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="send-button"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
