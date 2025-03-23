# ChatBot Web App

A minimalist chat interface using OpenAI's API, with model selection and persona options.

## Features

- OpenAI API integration
- Model selection (GPT-3.5, GPT-4, etc.)
- Persona selection to customize bot behavior
- Minimalist UI with image on left, chat on right

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
4. Run `npm start` to start the development server
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select an AI model from the dropdown
2. Choose a persona for the AI
3. Type your message and press Enter to send
4. View the AI's response in the chat window

## Technologies Used

- React
- OpenAI API
- Styled Components
- Axios 