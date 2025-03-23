import { logError, logDebug, logInfo } from '../utils/logger';

/**
 * Sends a message to the OpenAI API with streaming support
 * @param {string} message - The user's message
 * @param {string} model - The model ID to use
 * @param {string} personaPrompt - The persona instruction
 * @param {Array} messageHistory - Previous messages in the conversation
 * @param {Function} onStream - Callback function to handle streaming chunks
 * @returns {Promise<string>} - The complete assistant's response
 */
export const sendMessage = async (message, model, personaPrompt, messageHistory, onStream) => {
  // Check if API key exists
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('OpenAI API key is missing. Please add it to your .env file.');
    logError('API key missing', error);
    throw error;
  }

  // Format previous messages for the API
  const formattedHistory = messageHistory
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));

  // Create messages array with system message (persona) and history
  const messages = [
    ...([{ role: 'system', content: personaPrompt }]),
    ...formattedHistory,
    { role: 'user', content: message }
  ];

  const requestData = {
    model: model,
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
    stream: true
  };

  logDebug('Sending streaming request to OpenAI API', { 
    model, 
    messageCount: messages.length, 
    systemPrompt: personaPrompt
  });

  try {
    const startTime = Date.now();
    
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestData)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.choices[0].delta.content) {
              const content = parsed.choices[0].delta.content;
              fullResponse += content;
              if (onStream) {
                onStream(content);
              }
            }
          } catch (e) {
            logError('Error parsing streaming response', e);
          }
        }
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    logInfo('OpenAI API streaming response completed', {
      model,
      responseTime: `${responseTime}ms`,
      totalLength: fullResponse.length
    });

    return fullResponse;
  } catch (error) {
    // Enhanced error logging
    const statusCode = error.response?.status || 'Unknown';
    const errorType = error.response?.data?.error?.type || 'Unknown';
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    const requestId = error.response?.headers?.['x-request-id'] || 'Unknown';
    
    // Create error data object for logging
    const errorData = {
      statusCode,
      errorType,
      errorMessage,
      model,
      requestId,
      messageCount: messages.length
    };
    
    // Log error with different severity based on status code
    if (statusCode === 429) {
      logError('OpenAI API rate limit exceeded', errorData);
    } else if (statusCode >= 500) {
      logError('OpenAI server error', errorData);
    } else if (statusCode === 401) {
      logError('OpenAI authentication error', errorData);
    } else if (statusCode === 400) {
      logError('OpenAI bad request error', errorData);
    } else {
      logError('OpenAI API error', errorData);
    }
    
    throw new Error(`Failed to get response from OpenAI: ${errorMessage}`);
  }
}; 