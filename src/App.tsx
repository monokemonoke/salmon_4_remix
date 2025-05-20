import React, { useRef, useState, useEffect } from 'react';
import styles from './App.module.css';
import { SalmonBot } from './SalmonBot';
import { MdSend } from 'react-icons/md';

function App() {
  const [messages, setMessages] = useState([
    { speaker: 'bot', text: 'こんにちは！' }
  ]);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bot = useRef(new SalmonBot());

  // メッセージ更新時・初回マウント時に一番下までスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSend = () => {
    const text = inputRef.current?.value.trim() ?? '';
    if (!text) return;
    const { response } = bot.current.respond(text);
    setMessages(prev => [
      ...prev,
      { speaker: 'user', text },
      { speaker: 'bot', text: response.replace(/^サーモン：/, '') }
    ]);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.style.height = '48px';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = '48px'; // 初期化
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerGlass}>
        サーモン4号
      </header>
      <div
        ref={chatAreaRef}
        className={styles.chatArea}
      >
        {messages.map((msg, i) => (
          <div key={i} className={msg.speaker === 'user' ? styles.userMsg : styles.botMsg}>
            <span className={styles.speaker}>{msg.speaker === 'user' ? 'あなた' : 'Bot'}：</span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            className={styles.input}
            placeholder="メッセージを入力"
            rows={1}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            style={{resize: 'none', overflow: 'hidden'}}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            <MdSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
