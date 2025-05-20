import React, { useRef, useState } from 'react';
import { SalmonBot } from './SalmonBot';
import styles from './App.module.css';
import { MdOutlineChatBubble, MdSend } from 'react-icons/md';
import chatHistories from './chat_histories.json';

interface Message {
  speaker: string;
  text: string;
}

const bot = new SalmonBot();
const PAGE_SIZE = 20; // 1回で読み込む履歴数

function mapHistoryToMessage(item: any): Message {
  return {
    speaker: item['201'] === '人' ? 'あなた' : 'サーモン',
    text: item['件名'] || ''
  };
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { speaker: 'サーモン', text: 'こんにちは！' }
  ]);
  const [input, setInput] = useState('');
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 履歴の初期ロード
  React.useEffect(() => {
    if (messages.length === 1 && chatHistories.length > 0) {
      const initial = chatHistories.map(mapHistoryToMessage); // 全件表示
      setMessages([ ...initial ]);
      setHistoryPage(1);
      setHistoryLoaded(chatHistories.length <= PAGE_SIZE);
    }
    // eslint-disable-next-line
  }, []);

  // スクロールトップで過去履歴を追加
  const handleScroll = () => {
    if (!chatAreaRef.current || historyLoaded) return;
    if (chatAreaRef.current.scrollTop === 0) {
      const total = chatHistories.length;
      const nextPage = historyPage + 1;
      const start = Math.max(0, total - nextPage * PAGE_SIZE);
      const end = total - historyPage * PAGE_SIZE;
      if (start < end) {
        const more = chatHistories.slice(start, end).map(mapHistoryToMessage);
        setMessages(prev => [...more, ...prev]);
        setHistoryPage(nextPage);
        if (start === 0) setHistoryLoaded(true);
        // スクロール位置維持
        setTimeout(() => {
          if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = 1;
          }
        }, 0);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim() || finished) return;
    const currentInput = input;
    setInput('');
    const userMsg = { speaker: 'あなた', text: currentInput };
    const { response, finished: isFinished } = bot.respond(currentInput);
    setMessages(prev => [
      ...prev,
      userMsg,
      { speaker: 'サーモン', text: response.replace(/^サーモン：/, '') }
    ]);
    setFinished(isFinished);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerGlass}>
        <MdOutlineChatBubble size={24} color="#43a047" style={{verticalAlign: 'middle', marginRight: 8}} />
        サーモン4号
      </header>
      <div
        className={styles.chatArea}
        style={{marginTop: 0}}
        ref={chatAreaRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, i) => (
          <div key={i} className={msg.speaker === 'あなた' ? styles.userMsg : styles.botMsg}>
            <span className={styles.speaker} style={{color: '#222', fontWeight: 'bold'}}>{msg.speaker}：</span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={finished}
            className={styles.input}
            placeholder="メッセージを入力..."
            rows={2}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={finished || !input.trim()}
            className={styles.sendButton}
          >
            <MdSend size={22} style={{verticalAlign: 'middle'}} />
          </button>
        </div>
      </div>
      {finished && <div className={styles.finished}>チャットを終了しました。</div>}
    </div>
  );
}

export default App;
