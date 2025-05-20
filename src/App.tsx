import React, { useRef, useState, useEffect } from 'react';
import styles from './App.module.css';
import { SalmonBot } from './SalmonBot';
import { MdSend } from 'react-icons/md';

function App() {
  const [messages, setMessages] = useState([
    { speaker: 'bot', text: 'こんにちは！' }
  ]);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      inputRef.current.focus();
    }
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
          <input
            type="text"
            ref={inputRef}
            className={styles.input}
            placeholder="メッセージを入力"
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
