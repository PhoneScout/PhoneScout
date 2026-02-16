import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotWidget.css";

const TYPING_SPEED = 15;

const PHONES_DATA = `List of phones we sell:
      //IDE KELL MAJD BERAKNI A TELEFONOK ADATAIT, CSAK MÁSOLD BE A TXT TARTALMÁT AMIT TRELLÓRA AZ SQL KÁRTYÁHOZ RAKTAM
`;

const SYSTEM_INSTRUCTION = `
    You are a helpful assistant for PhoneScout, a mobile phone shop and service center.
    Use ONLY the information from the context below to answer the customer's question.
    If the question is unrelated to PhoneScout, politely say you cannot answer.
    
    Site name is PhoneScout. PhoneScout is a shop and service center for mobile phones.
    I am an assistant at PhoneScout, and I am here to help customers with any questions.

    PhoneScout services:
    - Selling new and used phones.
    - Phone repairs, including screen replacement and battery replacement.
    - Software updates for phones.
    - Data backup and transfer services.
    - Trade-in program for old phones.
    - Accessories: chargers, earphones, cases, and screen protectors.

    Warranty and returns:
    - All new phones have a 12-month warranty.
    - Used phones have a 6-month warranty.
    - Returns accepted within 14 days with receipt.
    - Repairs are guaranteed for 3 months after service.

    Common questions:
    - How can I buy a phone? Customers can visit the shop or order online.
    - Do you ship phones? Yes, we provide shipping within the country.
    - Can I trade in my old phone? Yes, PhoneScout accepts trade-ins for most major brands.
    - Do you offer financing? Yes, we have financing options for selected phones.
    - Can I repair my phone here? Yes, PhoneScout provides repair services for screens, batteries, and software issues.

    PhoneScout contact info:
    - Customers can contact us via email at phonescoutofficial@gmail.co or call +1-800-123-4567.
    - Our working hours are Monday to Friday, 9am to 6pm, and Saturday 10am to 4pm.

    Guidelines for the assistant:
    - Always answer questions related to phones sold and services offered.
    - If the customer asks about phones, provide specs and options.
    - If the customer asks about repair, shipping, trade-in, or warranty, provide relevant details.
    - If the question is unrelated to PhoneScout, politely say it is not about the site's topic, and never answer.
    - Dont answer any questions that doesn't go with the phone shop or service context. Tell the user that you cant help with the question and ask if they have any questions in connection with our website.
    - Don't recommend any other service, if the user asks about it, tell that you dont know any other repair shop.
    - Don't use any stylings during a response such as **, *, etc.
    - Give short understandable and easily digestible answers, avoid long and complex sentences if possible.
    - If the user asks something because he doesnt know, you can explan it to them, for example if they ask you to explain more about a part you can explan what does each thing mean and do. 
    - We dont sell any accessories. If the user asks about accessories, tell them that we dont sell any accessories but we can help with any questions about phones or repairs.
    - We dont sell used phones, only new phones.
    - We only repair phones, no other devices.
    - If the user asks about something that is not related to phones or phone repairs, tell them that you cant help with that question and ask if they have any questions in connection with our website.
    - If they ask about any phone related you can answer, for exaqmple about general information or such.
    - Dont recommend us in every single message, it is too much if you mention our service inm every message.
    - If the user wants service, they can fill a form too to request a repair.
    - If the user comes in person, they should fill the form for easier and faster service, but if they dont want to fill the form, it will take longer in person to 
    - After the user filled the form there is a description of what they have to do.
    `;

const QUICK_BUTTONS = [
  "Betört a kijelzőm",
  "Nem tölt a telefonom",
  "Nem kapcsol be a telefonom",
  "Az akkumulátor gyorsan lemerül",
  "Vízbe esett a telefonom",
  "Zöld csík van a kijelzőn",
  "Nem működik a kamera",
  "Nem hallanak telefonálás közben",
  "Fel van púposodva az akkumulátor",
  "Rezeg a kamera"
];

function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [inputValue, setInputValue] = useState("");

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

  const isServiceRelated = (text) => {
    const serviceKeywords = ["szerviz", "javít", "javítás", "szervizelni", "repair", "service", "hiba", "nem működik"];
    const lowerText = text.toLowerCase();
    return serviceKeywords.some(keyword => lowerText.includes(keyword));
  };

  const isBuyingRelated = (text) => {
    const buyingKeywords = ["vásárol", "venni", "akarok", "szeretnék", "telefont", "telefon", "buy", "purchase", "ár", "ára", "árak", "price", "cost", "érdekel", "melyik", "mely", "legjobb", "ajánl"];
    const lowerText = text.toLowerCase();
    return buyingKeywords.some(keyword => lowerText.includes(keyword));
  };

  const ask = async (question, options = {}) => {
    const { skipUser = false } = options;

    // Ha "START" üzenet, csak a welcome üzenetet mutatjuk, API-t nem hívunk
    if (question === "START") {
      addMessage({
        id: `bot-${Date.now()}`,
        role: "answer",
        text: "Üdvözöllek a PhoneScout ügyfélszolgálatban! 👋\n\nMiben segíthetek?"
      });
      setShowQuickButtons(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowQuickButtons(false);

    if (!skipUser) {
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
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY nincs beállítva a .env fájlban");
      }

      const conversationHistory = historyRef.current.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Dinamikusan adjuk hozzá a telefonok adatait az aktuális kérdéshez, ha vásárlásról van szó
      let userQuestion = question;
      if (isBuyingRelated(question)) {
        userQuestion = `${PHONES_DATA}\n\nFelhasználó kérdése: ${question}`;
      }

      const requestBody = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
          ...conversationHistory,
          {
            role: "user",
            parts: [{ text: userQuestion }]
          }
        ]
      };

      const res = await fetch(
        // ITT A VÁLTOZÁS: gemini-2.5-pro
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`API hiba ${res.status}: ${errorData?.error?.message || "Ismeretlen hiba"}`);
      }

      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nem kaptam választ.";

      historyRef.current.push({ role: "user", text: question });
      historyRef.current.push({ role: "assistant", text: answer });

      await typeMessage(loadingId, answer, TYPING_SPEED);

      // Ha a válasz szervízhez kapcsolódik, adjunk hozzá egy gombat
      if (isServiceRelated(answer)) {
        addMessage({
          id: `service-btn-${Date.now()}`,
          role: "service-button",
          text: "szerviz"
        });
      }

      setFollowUps([]);
    } catch (err) {
      console.error("Chat hiba:", err);
      updateMessage(loadingId, {
        role: "answer",
        text: `Hiba történt: ${err.message}`
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
    setShowQuickButtons(true);
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
          <div className="header-content">
            <img src="/images/ChatBotLogo.png" alt="Chatbot Logo" className="header-logo" />
            <span>Segéd</span>
          </div>
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
              ) : message.role === "service-button" ? (
                <button
                  className="service-button-link"
                  onClick={() => navigate("/szerviz")}
                >
                  Szervíz igénylése
                </button>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        <div className="buttons">
          {showQuickButtons && (
            <div className="quick-buttons">
              {QUICK_BUTTONS.map((text) => (
                <button
                  key={text}
                  onClick={() => ask(text)}
                  disabled={isLoading}
                  className="quick-btn"
                >
                  {text}
                </button>
              ))}
            </div>
          )}
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

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                ask(inputValue);
                setInputValue("");
              }
            }}
            placeholder="Írj egy üzenetet..."
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                ask(inputValue);
                setInputValue("");
              }
            }}
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
          >
            Küldés
          </button>
        </div>
      </div>

      <div
        className={`chat-bubble ${showBubble ? "visible" : ""}`}
        onClick={openChat}
      >
        <img src="/images/ChatBotLogo.png" alt="Chatbot" className="chatbot-logo-img" />
      </div>
    </div>
  );
}

export default ChatbotWidget;
