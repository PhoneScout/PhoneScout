// Chatbot configuration
export const CHATBOT_CONFIG = {
  // Embedding model for semantic search
  EMBEDDING_MODEL: 'Xenova/all-MiniLM-L6-v2',
  
  // Text generation model (local LLM)
  TEXT_GENERATION_MODEL: 'Xenova/opt-iml-max-1.3b',
  
  // Max response length
  MAX_RESPONSE_LENGTH: 200,
  
  // Number of top documents to retrieve
  TOP_DOCS_COUNT: 3,
  
  // Cosine similarity threshold (optional)
  SIMILARITY_THRESHOLD: 0.1,
};
