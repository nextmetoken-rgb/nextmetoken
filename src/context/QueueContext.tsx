"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastState } from "../components/ui/Toast";
import { announceTokenNumber, announceYourTurn } from "../utils/audio";

export interface TokenItem {
  id: string;
  queueId: string;
  businessName: string;
  number: number;
  userName: string;
  isWalkin: boolean;
  status: "waiting" | "next" | "now" | "done" | "withdrawn" | "removed" | "skipped" | "closed";
  issuedAt: string;
  calledAt?: string;
  doneAt?: string;
  estimatedMinutes: number;
}

export interface QueueSession {
  id: string;
  queueId: string;
  startedAt: string;
  endedAt?: string;
  startNumber: number;
  currentNumber: number;
}

export interface QueueItem {
  id: string;
  code: string;
  name: string;
  counterName?: string;
  tokenLimit?: number;
  avgTimeMode: "auto" | "custom";
  avgTimeMin: number;
  startNumber: number;
  status: "live" | "paused" | "closed" | "deleted";
  currentNumber: number;
  lastUsedText?: string;
  deletedAt?: string;
  purgeAt?: string;
  sessions: QueueSession[];
}

export interface QueueContextType {
  queues: QueueItem[];
  tokens: TokenItem[];
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState["type"], actionLabel?: string, onAction?: () => void) => void;
  dismissToast: () => void;
  issueToken: (queueCode: string, name: string) => TokenItem;
  withdrawToken: (tokenId: string) => void;
  nextNumber: (queueId: string) => void;
  prevNumber: (queueId: string) => void;
  addWalkin: (queueId: string, name: string) => void;
  removeUser: (queueId: string, tokenId: string) => void;
  pauseQueue: (queueId: string) => void;
  resumeQueue: (queueId: string) => void;
  endDay: (queueId: string) => void;
  reopenQueue: (queueId: string) => void;
  deleteQueue: (queueId: string) => void;
  restoreQueue: (queueId: string) => void;
  purgeQueue: (queueId: string) => void;
  createQueue: (data: Partial<QueueItem>) => QueueItem;
  getQueueByCode: (code: string) => QueueItem | undefined;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const SAMPLE_QUEUES: QueueItem[] = [
  {
    id: "q_sharma",
    code: "sharma123",
    name: "Sharma Sweets",
    counterName: "Counter 1",
    avgTimeMode: "auto",
    avgTimeMin: 3,
    startNumber: 1,
    status: "live",
    currentNumber: 12,
    sessions: [
      {
        id: "s_today",
        queueId: "q_sharma",
        startedAt: "9:00 AM",
        startNumber: 1,
        currentNumber: 12,
      },
    ],
  },
];

const SAMPLE_TOKENS: TokenItem[] = [
  {
    id: "t_19",
    queueId: "q_sharma",
    businessName: "Sharma Sweets",
    number: 19,
    userName: "Rahul Verma",
    isWalkin: false,
    status: "waiting",
    issuedAt: "10:12 AM",
    estimatedMinutes: 25,
  },
  {
    id: "t_13",
    queueId: "q_sharma",
    businessName: "Sharma Sweets",
    number: 13,
    userName: "Amit Kumar",
    isWalkin: false,
    status: "waiting",
    issuedAt: "10:00 AM",
    estimatedMinutes: 5,
  },
  {
    id: "t_14",
    queueId: "q_sharma",
    businessName: "Sharma Sweets",
    number: 14,
    userName: "Priya Sharma",
    isWalkin: true,
    status: "waiting",
    issuedAt: "10:02 AM",
    estimatedMinutes: 10,
  },
];

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queues, setQueues] = useState<QueueItem[]>(SAMPLE_QUEUES);
  const [tokens, setTokens] = useState<TokenItem[]>(SAMPLE_TOKENS);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [historyStack, setHistoryStack] = useState<Record<string, number>>({});

  useEffect(() => {
    const qData = localStorage.getItem("app_queues");
    if (qData) {
      try {
        setQueues(JSON.parse(qData));
      } catch {}
    }

    const tData = localStorage.getItem("app_tokens");
    if (tData) {
      try {
        setTokens(JSON.parse(tData));
      } catch {}
    }
  }, []);

  const saveQueues = (newQ: QueueItem[]) => {
    setQueues(newQ);
    localStorage.setItem("app_queues", JSON.stringify(newQ));
  };

  const saveTokens = (newT: TokenItem[]) => {
    setTokens(newT);
    localStorage.setItem("app_tokens", JSON.stringify(newT));
  };

  const showToast = (
    message: string,
    type: ToastState["type"] = "info",
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToast({
      id: String(Date.now()),
      message,
      type,
      actionLabel,
      onAction,
    });
  };

  const dismissToast = () => {
    setToast(null);
  };

  const getQueueByCode = (code: string) => {
    return queues.find((q) => q.code === code || q.id === code);
  };

  const issueToken = (queueCode: string, name: string): TokenItem => {
    const queue = getQueueByCode(queueCode);
    const businessName = queue ? queue.name : "TokenApp";

    // Atomic next available number assignment
    const existingForQueue = tokens.filter((t) => t.queueId === (queue?.id || queueCode));
    const maxNum = Math.max(queue?.currentNumber || 0, ...existingForQueue.map((t) => t.number), 18);
    const assignedNumber = maxNum + 1;

    const newToken: TokenItem = {
      id: `t_${Date.now()}`,
      queueId: queue?.id || queueCode,
      businessName,
      number: assignedNumber,
      userName: name,
      isWalkin: false,
      status: "waiting",
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      estimatedMinutes: 25,
    };

    saveTokens([newToken, ...tokens]);
    showToast(`Token mil gaya: #${assignedNumber}`, "success");
    return newToken;
  };

  const withdrawToken = (tokenId: string) => {
    const updated = tokens.map((t) => (t.id === tokenId ? { ...t, status: "withdrawn" as const } : t));
    saveTokens(updated);
    showToast("Aapne line chhod di", "info");
  };

  const nextNumber = (queueId: string) => {
    const queue = queues.find((q) => q.id === queueId);
    if (!queue) return;

    const prevNum = queue.currentNumber;
    const nextNum = prevNum + 1;

    // Save previous for 5s undo
    setHistoryStack((prev) => ({ ...prev, [queueId]: prevNum }));

    const updatedQueues = queues.map((q) => (q.id === queueId ? { ...q, currentNumber: nextNum } : q));
    saveQueues(updatedQueues);

    // Update tokens statuses
    const updatedTokens = tokens.map((t) => {
      if (t.queueId === queueId) {
        if (t.number === nextNum) {
          announceYourTurn(queue.name);
          return { ...t, status: "now" as const, calledAt: new Date().toLocaleTimeString() };
        } else if (t.number === nextNum + 1) {
          return { ...t, status: "next" as const };
        } else if (t.number < nextNum && t.status !== "done" && t.status !== "withdrawn" && t.status !== "removed") {
          return { ...t, status: "done" as const, doneAt: new Date().toLocaleTimeString() };
        }
      }
      return t;
    });
    saveTokens(updatedTokens);

    announceTokenNumber(nextNum);
    showToast(`Number #${nextNum} par gaye`, "undo", "Undo", () => {
      // Revert to prevNum
      setQueues(queues.map((q) => (q.id === queueId ? { ...q, currentNumber: prevNum } : q)));
    });
  };

  const prevNumber = (queueId: string) => {
    const queue = queues.find((q) => q.id === queueId);
    if (!queue || queue.currentNumber <= 1) return;

    const prevNum = queue.currentNumber - 1;
    saveQueues(queues.map((q) => (q.id === queueId ? { ...q, currentNumber: prevNum } : q)));
    showToast(`Number #${prevNum} par wapas gaye`, "info");
  };

  const addWalkin = (queueId: string, name: string) => {
    const queue = queues.find((q) => q.id === queueId);
    if (!queue) return;

    const maxNum = Math.max(queue.currentNumber, ...tokens.filter((t) => t.queueId === queueId).map((t) => t.number));
    const walkinNum = maxNum + 1;

    const newToken: TokenItem = {
      id: `walk_${Date.now()}`,
      queueId,
      businessName: queue.name,
      number: walkinNum,
      userName: name,
      isWalkin: true,
      status: "waiting",
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      estimatedMinutes: 20,
    };

    saveTokens([newToken, ...tokens]);
    showToast(`${name} ko number #${walkinNum} mila`, "success");
  };

  const removeUser = (queueId: string, tokenId: string) => {
    const targetToken = tokens.find((t) => t.id === tokenId);
    const updated = tokens.map((t) => (t.id === tokenId ? { ...t, status: "removed" as const } : t));
    saveTokens(updated);

    if (targetToken) {
      showToast(`#${targetToken.number} hata diya`, "undo", "Undo", () => {
        saveTokens(tokens);
      });
    }
  };

  const pauseQueue = (queueId: string) => {
    saveQueues(queues.map((q) => (q.id === queueId ? { ...q, status: "paused" as const } : q)));
    showToast("Line thodi der ke liye ruki hai", "info");
  };

  const resumeQueue = (queueId: string) => {
    saveQueues(queues.map((q) => (q.id === queueId ? { ...q, status: "live" as const } : q)));
    showToast("Line chalu ho gayi", "success");
  };

  const endDay = (queueId: string) => {
    saveQueues(
      queues.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: "closed" as const,
              lastUsedText: `Aakhri baar: Aaj · ${q.currentNumber} token`,
            }
          : q
      )
    );

    // Set pending tokens to closed/expired
    const updatedTokens = tokens.map((t) =>
      t.queueId === queueId && t.status === "waiting" ? { ...t, status: "closed" as const } : t
    );
    saveTokens(updatedTokens);

    showToast("Din khatam. Dobara shuru karne ke liye Business tab me jayein.", "info");
  };

  const reopenQueue = (queueId: string) => {
    saveQueues(queues.map((q) => (q.id === queueId ? { ...q, status: "live" as const, currentNumber: 1 } : q)));
    showToast("Nayi shuruaat. Number 1 se chalu.", "success");
  };

  const deleteQueue = (queueId: string) => {
    const deletedAtStr = new Date().toISOString();
    const purgeAtStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    saveQueues(
      queues.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: "deleted" as const,
              deletedAt: deletedAtStr,
              purgeAt: purgeAtStr,
            }
          : q
      )
    );
    showToast("Queue delete ho gayi (Recently Deleted me 3 din)", "info");
  };

  const restoreQueue = (queueId: string) => {
    saveQueues(
      queues.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: "closed" as const,
              deletedAt: undefined,
              purgeAt: undefined,
            }
          : q
      )
    );
    showToast("Queue wapas aa gayi.", "success");
  };

  const purgeQueue = (queueId: string) => {
    saveQueues(queues.filter((q) => q.id !== queueId));
    showToast("Queue hamesha ke liye hat gayi", "info");
  };

  const createQueue = (data: Partial<QueueItem>): QueueItem => {
    const newQueue: QueueItem = {
      id: `q_${Date.now()}`,
      code: `code_${Math.random().toString(36).substring(2, 8)}`,
      name: data.name || "Nayi Queue",
      counterName: data.counterName,
      tokenLimit: data.tokenLimit,
      avgTimeMode: data.avgTimeMode || "auto",
      avgTimeMin: data.avgTimeMin || 3,
      startNumber: data.startNumber || 1,
      status: "live",
      currentNumber: data.startNumber || 1,
      sessions: [
        {
          id: `s_${Date.now()}`,
          queueId: `q_${Date.now()}`,
          startedAt: "9:00 AM",
          startNumber: data.startNumber || 1,
          currentNumber: data.startNumber || 1,
        },
      ],
    };
    saveQueues([newQueue, ...queues]);
    showToast("Queue ban gayi", "success");
    return newQueue;
  };

  return (
    <QueueContext.Provider
      value={{
        queues,
        tokens,
        toast,
        showToast,
        dismissToast,
        issueToken,
        withdrawToken,
        nextNumber,
        prevNumber,
        addWalkin,
        removeUser,
        pauseQueue,
        resumeQueue,
        endDay,
        reopenQueue,
        deleteQueue,
        restoreQueue,
        purgeQueue,
        createQueue,
        getQueueByCode,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within QueueProvider");
  }
  return context;
};
