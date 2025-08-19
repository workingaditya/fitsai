import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes the Gemini client with the API key from environment variables.
 * @returns {GoogleGenerativeAI} Configured Gemini client instance.
 */
let genAI = null;

try {
  // Check if API key is available and valid
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.warn('Gemini API key not configured. Gemini features will be unavailable.');
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Gemini client:', error);
  genAI = null;
}

export default genAI;