import dialogs from './dialogs.json';
import logs from './logs.json';
import chatHistoriesData from './chat_histories.json';

const BOKE_WORDS = [
    "なるほど！",
    "すいません。人工無脳なのでわかりません。",
    "へぇ～",
    "そうなんですね！",
    "そうかな～？",
    "今何をしていますか？",
    "知らなかった！",
    "笑",
    "興味深いですね！",
    "えっっ・・・"
];
const SAYONARA_WORDS = [
    "さよなら",
    "さよなら！",
    "さようなら",
    "さようなら！",
    "またね！",
    "じゃあね！"
];

export interface DialogRow {
    id: string;
    user: string;
    bot: string;
}
export interface LogRow {
    id: string;
    message: string;
}
export interface ChatHistoryRow {
    id: string;
    speaker: string;
    message: string;
}

function parseDialogs(): DialogRow[] {
    // dialogs.jsonの各行をDialogRowに変換
    return (dialogs as any[]).map(row => ({
        id: row["No."],
        user: row["件名"],
        bot: row["件数"]
    })).filter(row => row.user && row.bot && row.bot !== "件名");
}
function parseLogs(): LogRow[] {
    return (logs as any[]).map(row => ({
        id: row["No."],
        message: row["件名"]
    })).filter(row => row.message);
}
function parseChatHistories(): ChatHistoryRow[] {
    return (chatHistoriesData as any[]).map(row => ({
        id: row["No."],
        speaker: row["201"],
        message: row["件名"]
    })).filter(row => row.speaker && row.message);
}

export class SalmonBot {
    dialogs: DialogRow[];
    logs: LogRow[];
    chatHistories: ChatHistoryRow[];
    private random: () => number;

    constructor(randomFn?: () => number) {
        this.dialogs = parseDialogs();
        this.logs = parseLogs();
        this.chatHistories = parseChatHistories();
        this.random = randomFn || Math.random;
    }

    private getRandomBoke(): string {
        return BOKE_WORDS[Math.floor(this.random() * BOKE_WORDS.length)];
    }

    private addChatHistory(speaker: string, message: string) {
        const id = (this.chatHistories.length + 1).toString();
        this.chatHistories.push({ id, speaker, message });
    }

    private addLog(message: string) {
        const id = (this.logs.length + 1).toString();
        this.logs.push({ id, message });
    }

    private getResponse(userInput: string): string {
        const dialog = this.dialogs.find(row => userInput === row.user);
        if (dialog && dialog.bot !== "件名") {
            return dialog.bot;
        }
        if (this.logs.length <= 10) {
            return this.getRandomBoke();
        }
        if (this.logs.length > 0) {
            const randomLog = this.logs[Math.floor(this.random() * this.logs.length)].message;
            return randomLog || this.getRandomBoke();
        }
        return this.getRandomBoke();
    }

    respond(userInput: string): { response: string; finished: boolean } {
        if (SAYONARA_WORDS.includes(userInput)) {
            return { response: "さよなら。また今度！", finished: true };
        }
        this.addChatHistory("人", userInput);
        if (userInput !== "こんにちは" && userInput !== "こんにちは！") {
            this.addLog(userInput);
        }
        const response = this.getResponse(userInput);
        this.addChatHistory("サーモン", response);
        return { response: `サーモン：${response}`, finished: false };
    }
} 