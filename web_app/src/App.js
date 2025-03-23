import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ChatInterface from './components/ChatInterface';
import Picker from './components/Picker';
import { sendMessage } from './api/openai';
import { logError, logInfo } from './utils/logger';
import botImage from './assets/bot-image.svg';
import { CONTEXTS } from './assets/prompts/context';
import { PERSONAS } from './assets/prompts/Personas';
import logoImage from './assets/logo.svg';

// Define global styles to apply font app-wide
const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'HeroNew', sans-serif;
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedContext, setSelectedContext] = useState(CONTEXTS[0]);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);

  const handleSendMessage = async (messageText) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(false);
    
    logInfo('User message sent', { 
      context: selectedContext.name,
      persona: selectedPersona.name
    });
    
    try {
      // Create a temporary message for streaming
      const streamingMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: ''
      };
      setMessages(prev => [...prev, streamingMessage]);
      setIsStreaming(true);

      await sendMessage(
        messageText, 
        "ft:gpt-4o-2024-08-06:vladislav-komkov::BDtOpcWX", 
        selectedContext.prompt + selectedPersona.prompt + "Do not anwser questions that are not related to Ackee.",
        messages,
        (chunk) => {
          // Update the streaming message with new chunks
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );
      
      logInfo('Bot response received and displayed');
      
    } catch (error) {
      logError('Error handling message in App component', error);
      
      // Extract the error message
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      // Try to get a more specific error message if available
      if (error.message.includes('Failed to get response from OpenAI:')) {
        const specificError = error.message.split('Failed to get response from OpenAI:')[1].trim();
        
        if (specificError.includes('Rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (specificError.includes('maximum context length')) {
          errorMessage = 'The conversation is too long. Please start a new chat.';
        } else if (specificError.includes('API key')) {
          errorMessage = 'Authentication error. Please check your API key configuration.';
        } else if (specificError && specificError !== 'Unknown error') {
          // Use the specific error if it's meaningful
          errorMessage = `Error: ${specificError}`;
        }
      } else if (error.message.includes('API key is missing')) {
        errorMessage = 'OpenAI API key is missing. Please add it to your .env file.';
      }
      
      logInfo('Displaying error message to user', { errorMessage });
      
      const botErrorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
        isError: true
      };
      
      setMessages(prev => [...prev, botErrorMessage]);
    }
    
    setIsLoading(false);
    setIsStreaming(false);
  };

  const handleContextChange = (context) => {
    setSelectedContext(context);
  };

  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona);
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <Header>
        <Logo src={logoImage} alt="Company Logo" />
        <HeaderTitle>GPT</HeaderTitle>
      </Header>
      <MainContent>
        <LeftPanel>
          <ImageContainer>
            <BotImage src={botImage} alt="AI Assistant" />
          </ImageContainer>
          <SelectorsContainer>
            <Picker 
              label="Context"
              options={CONTEXTS}
              selectedOption={selectedContext}
              onOptionChange={handleContextChange}
              hideSettings={true}
            />
            <Picker 
              label="Persona"
              options={PERSONAS}
              selectedOption={selectedPersona}
              onOptionChange={handlePersonaChange}
              hideSettings={true}
            />
          </SelectorsContainer>
        </LeftPanel>
        <RightPanel>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            isStreaming={isStreaming}
            onClearChat={() => setMessages([])}
          />
        </RightPanel>
      </MainContent>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: white;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eaeaea;
`;

const Logo = styled.img`
  height: 32px;
  margin-right: 1rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: white;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 40%;
    order: 2;
    padding: 1rem;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const BotImage = styled.img`
  max-width: 80%;
  max-height: 60%;
  object-fit: contain;
`;

const SelectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightPanel = styled.div`
  width: 60%;
  height: 100%;
  background-color: white;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 60%;
    order: 1;
  }
`;

export default App; 