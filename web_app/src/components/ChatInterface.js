import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const ChatInterface = ({ messages, onSendMessage, isLoading, isStreaming, onClearChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <Container>
      <ChatHeader>
        <h2>Chat</h2>
        <ClearButton onClick={onClearChat} disabled={messages.length === 0}>
          Clear Chat
        </ClearButton>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.length === 0 && (
          <WelcomeMessage>
            <h3>Welcome to the AckeeGPT!</h3>
            <p>Start a conversation with the AI assistant by typing a message below.</p>
          </WelcomeMessage>
        )}
        
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            isUser={message.role === 'user'}
            isError={message.isError}
          >
            <MessageContent>
              <ReactMarkdown>{message.content || ''}</ReactMarkdown>
            </MessageContent>
          </MessageBubble>
        ))}
        
        {isLoading && !isStreaming && (
          <MessageBubble isUser={false}>
            <LoadingDots>
              <span></span>
              <span></span>
              <span></span>
            </LoadingDots>
          </MessageBubble>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputForm onSubmit={handleSubmit}>
        <MessageInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton 
          type="submit"
          disabled={isLoading || !input.trim()}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </SendButton>
      </InputForm>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: white;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--light-gray);
    color: var(--text-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin: auto;
  padding: 2rem;
  max-width: 80%;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.5;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => {
    if (props.isError) return '#fee2e2';
    return props.isUser ? 'var(--primary-color)' : 'var(--light-gray)';
  }};
  color: ${props => props.isUser ? 'white' : 'var(--text-color)'};
  box-shadow: var(--shadow-sm);
`;

const MessageContent = styled.div`
  line-height: 1.5;
  white-space: pre-wrap;
  
  p {
    margin: 0.5rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    color: ${props => props.theme.isUser ? 'white' : 'var(--primary-color)'};
    text-decoration: underline;
  }
  
  code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
  
  pre {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  span {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: var(--text-secondary);
    opacity: 0.7;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;

const InputForm = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: white;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: 0.5rem;
  border: none;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }
  
  &:disabled {
    background-color: var(--secondary-color);
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default ChatInterface; 