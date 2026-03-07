import React, { useEffect, useState } from 'react';
import './ScrollToTopButton.css';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 250);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const handleChatbotState = (event) => {
      setIsChatbotOpen(Boolean(event?.detail?.isOpen));
    };

    window.addEventListener('chatbotStateChange', handleChatbotState);

    return () => {
      window.removeEventListener('chatbotStateChange', handleChatbotState);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className={`scrollToTopButton ${isChatbotOpen ? 'chatbot-open' : ''}`}
      onClick={scrollToTop}
      aria-label="Ugrás az oldal tetejére"
      title="Ugrás az oldal tetejére"
    >
      ↑
    </button>
  );
}
