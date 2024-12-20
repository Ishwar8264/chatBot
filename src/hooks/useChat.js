import { useState, useEffect } from 'react';
import { saveChatHistory, loadChatHistory } from '../utils/localStorage';
import questionAnswers from "../data/data"; // Ensure this is imported correctly

const useChat = () => {
      const [messages, setMessages] = useState(loadChatHistory() || []);
      const [isTyping, setIsTyping] = useState(false);

      const sendMessage = (text) => {
            if (!text.trim()) return;

            const userMessage = {
                  text,
                  sender: 'user',
                  timestamp: new Date(),
            };

            setMessages((prevMessages) => [...prevMessages, userMessage]);

            const userText = text.toLowerCase().trim();

            // Search for a match in the questionAnswers (case-insensitive and allows for partial matching)
            const foundAnswer = questionAnswers.find(qa =>
                  qa.question.toLowerCase().includes(userText)
            );

            // If an answer is found, send it as the bot's response
            if (foundAnswer) {
                  setIsTyping(true);
                  setTimeout(() => {
                        const botMessage = {
                              text: foundAnswer.answer,
                              sender: 'bot',
                              timestamp: new Date(),
                        };
                        setMessages((prevMessages) => [...prevMessages, botMessage]);
                        setIsTyping(false);
                  }, 1000);
            } else {
                  // If no match found, return a generic response
                  setIsTyping(true);
                  setTimeout(() => {
                        const botMessage = {
                              text: "Sorry, I don't understand that question.",
                              sender: 'bot',
                              timestamp: new Date(),
                        };
                        setMessages((prevMessages) => [...prevMessages, botMessage]);
                        setIsTyping(false);
                  }, 1000);
            }
      };

      // Function to handle editing a message
      const editMessage = (index, newText) => {
            const updatedMessages = [...messages];
            updatedMessages[index].text = newText;

            // Normalize updated text for better matching
            const userText = newText.toLowerCase().trim();

            // Find the corresponding bot message and update it based on the new user input
            const foundAnswer = questionAnswers.find(qa =>
                  qa.question.toLowerCase().includes(userText)
            );

            if (foundAnswer) {
                  updatedMessages[index + 1] = {
                        text: foundAnswer.answer,
                        sender: 'bot',
                        timestamp: new Date(),
                  };
            } else {
                  updatedMessages[index + 1] = {
                        text: "Sorry, I don't understand that question.",
                        sender: 'bot',
                        timestamp: new Date(),
                  };
            }

            setMessages(updatedMessages);
      };

      // Effect to save chat history whenever messages change
      useEffect(() => {
            saveChatHistory(messages); // Ensure messages are saved to local storage
      }, [messages]);

      return {
            messages,
            isTyping,
            sendMessage,
            setMessages,
            editMessage, // Expose the editMessage function
      };
};

export default useChat;
