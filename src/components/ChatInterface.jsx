import React, { useState, useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { FaTrash, FaEdit, FaRobot, FaSun, FaMoon } from "react-icons/fa";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import useChat from "../hooks/useChat";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("chatbottheme") ? true : false
  );
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track if user has interacted
  const chatRef = useRef(null);
  const messageEndRef = useRef(null);
  const { messages, isTyping, sendMessage, setMessages, editMessage } =
    useChat();

  const toggleDarkMode = () => {
    if (!isDarkMode) {
      localStorage.setItem("chatbottheme", "yes");
    } else {
      localStorage.removeItem("chatbottheme");
    }
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const handleSend = () => {
    if (input.trim()) {
      if (editIndex !== null) {
        editMessage(editIndex, input);
        setEditIndex(null);
      } else {
        sendMessage(input);
      }
      setInput("");
      setHasUserInteracted(true); // Mark interaction after sending a message
    }
  };

  const handleClearInput = () => setInput("");

  const handleClearChat = () => {
    setMessages([]);
    setHasUserInteracted(false); // Reset interaction state
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setInput(messages[index].text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`flex flex-col w-full h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header */}
      <header className="w-full p-4 text-center text-xl font-bold shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        Chat Interface
      </header>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-md"
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      {/* Animated Content (fade in/out on first interaction) */}
      <div
        className={`welcome-message px-10 bg-none absolute top-24 ${
          hasUserInteracted ? "opacity-0" : "opacity-100"
        } transition-opacity duration-1000`}
      >
        <p className="text-lg font-semibold">Welcome to Our Chatbot! 👋</p>
        <p>
          We're thrilled to have you here! 😊 Whether you're looking for help,
          information, or just want to chat, we're ready to assist you.
        </p>
        <p>How can I help you today? Feel free to ask anything!</p>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex md:mt-[100px] ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "user" && (
              <div className="max-w-xs p-3 bg-gray-700 text-white rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <FaRobot size={20} className="text-green-400" />
                  <Message message={msg} />
                </div>
              </div>
            )}
            {msg.sender === "user" && (
              <div className="max-w-xs px-2 bg-blue-500 text-white rounded-lg shadow-md">
                <div className="flex   space-x-2">
                  <Message message={msg} />
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-yellow-300 flex mt-2 hover:text-yellow-400"
                  >
                    <FaEdit size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input Area */}
      <div
        className={`p-4 border-t shadow-inner flex w-full gap-3 items-center ${
          isDarkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-gray-200 border-gray-300"
        }`}
      >
        <div className="relative flex justify-center items-center w-full space-x-3 ">
          {/* Textarea */}
          <textarea
            className={`w-full px-2 py-1 rounded-lg resize-none focus:ring-2 focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
                : "bg-white text-black border-gray-300 focus:ring-blue-500"
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={
              editIndex !== null ? "Edit your message..." : " message..."
            }
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="absolute right-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none shadow-md"
          >
            <IoMdSend size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 ">
          <button
            onClick={handleClearChat}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none shadow-md flex items-center space-x-1"
          >
            <FaTrash size={20} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
