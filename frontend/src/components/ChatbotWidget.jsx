import React, { useEffect, useRef, useState } from "react";
import "./ChatbotWidget.css";

const TYPING_SPEED = 15;

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const historyRef = useRef([]);
  const chatRef = useRef(null);
  const widgetRef = useRef(null);
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 100);
    ask("START", { skipUser: true });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, followUps, isLoading]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.isDragging || !widgetRef.current) return;
      const left = e.clientX - dragRef.current.offsetX;
      const top = e.clientY - dragRef.current.offsetY;
      widgetRef.current.style.left = `${left}px`;
      widgetRef.current.style.top = `${top}px`;
      widgetRef.current.style.right = "auto";
      widgetRef.current.style.bottom = "auto";
    };

    const handleUp = () => {
      dragRef.current.isDragging = false;
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (id, patch) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const typeMessage = async (id, text, speed = TYPING_SPEED) => {
    updateMessage(id, { role: "answer", text: "" });
    let current = "";
    for (let i = 0; i < text.length; i += 1) {
      current += text[i];
      updateMessage(id, { text: current });
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  };

  const ask = async (question, options = {}) => {
    const { skipUser = false } = options;
    setIsLoading(true);

    if (question !== "START" && !skipUser) {
      addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        text: question
      });
    }

    const loadingId = `loading-${Date.now()}`;
    addMessage({
      id: loadingId,
      role: "loading",
      text: "AI gondolkodik..."
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: historyRef.current })
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      historyRef.current = data.history || historyRef.current;
      await typeMessage(loadingId, data.answer || "", TYPING_SPEED);
      setFollowUps(Array.isArray(data.followUps) ? data.followUps : []);
    } catch (err) {
      updateMessage(loadingId, {
        role: "answer",
        text: "Hiba történt a kérdés feldolgozása közben."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    historyRef.current = [];
    addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      text: "🏠 Vissza a kezdőlapra"
    });
    setFollowUps([]);
    ask("START", { skipUser: true });
  };

  const openChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => setShowBubble(true), 300);
  };

  const handleHeaderMouseDown = (e) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    dragRef.current.isDragging = true;
    dragRef.current.offsetX = e.clientX - rect.left;
    dragRef.current.offsetY = e.clientY - rect.top;
  };

  return (
    <div className="ps-chatbot">
      <div ref={widgetRef} className={`chat-widget ${isOpen ? "open" : ""}`}>
        <div className="chat-header" onMouseDown={handleHeaderMouseDown}>
          <span>Segéd</span>
          <span className="chat-close" onClick={closeChat}>
            −
          </span>
        </div>
        <div className="chat" ref={chatRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === "user" ? "user" : message.role}`}
            >
              {message.role === "loading" ? (
                <>
                  <div className="loader" />
                  <span>{message.text}</span>
                </>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        <div className="buttons">
          <button className="home-btn" onClick={goHome} disabled={isLoading}>
            🏠 Kezdőlap
          </button>
          {followUps.map((question) => (
            <button
              key={question}
              onClick={() => ask(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`chat-bubble ${showBubble ? "visible" : ""}`}
        onClick={openChat}
      >
        💬
      </div>
    </div>
  );
}

export default ChatbotWidget;
