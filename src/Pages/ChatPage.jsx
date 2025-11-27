import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  TrendingUp,
  BarChart3,
  X,
  Zap,
  Bot,
  ChevronDown,
} from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [chatMode, setChatMode] = useState("openrouter"); // local, openrouter
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const API_BASE_URL = "http://127.0.0.1:5000/api";

  const chatModes = {
    local: {
      label: "Local Only",
      icon: MessageCircle,
      description: "Fast pattern-matched responses only",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    openrouter: {
      label: "AI (OpenRouter)",
      icon: Bot,
      description: "Full AI-powered responses",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isChatEnded) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let endpoint = "";
      let requestBody = {};

      if (chatMode === "local") {
        // Use local simple-chat endpoint
        endpoint = `${API_BASE_URL}/simple-chat`;
        requestBody = { message: inputMessage };
      } else if (chatMode === "openrouter") {
        // Use OpenRouter directly
        endpoint = `${API_BASE_URL}/chat`;
        requestBody = {
          message: inputMessage,
          history: messages,
          use_simple: false,
        };
      } else {
        // Auto mode: let backend decide
        endpoint = `${API_BASE_URL}/chat`;
        requestBody = {
          message: inputMessage,
          history: messages,
          use_simple: true,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      // Handle local mode with no match
      if (chatMode === "local" && data.status === "no_match") {
        const assistantMessage = {
          role: "assistant",
          content:
            "I can only respond to simple greetings in Local mode. Try switching AI mode for more complex questions.",
          timestamp: new Date().toISOString(),
          type: "system",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const assistantMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
          type: data.type || "ai",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        type: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endChat = () => {
    setIsChatEnded(true);
  };

  const analyzeConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (error) {
      console.error("Error analyzing conversation:", error);
      alert("Failed to analyze conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setIsChatEnded(false);
    setShowAnalysis(false);
    setAnalysis(null);
    setInputMessage("");
  };

  const getSentimentColor = (sentiment) => {
    return sentiment === "Positive" ? "text-green-600" : "text-red-600";
  };

  const getSentimentBgColor = (sentiment) => {
    return sentiment === "Positive" ? "bg-green-100" : "bg-red-100";
  };

  const getMessageBadge = (type) => {
    if (type === "simple") {
      return (
        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">
          Fast
        </span>
      );
    } else if (type === "ai") {
      return (
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full ml-2">
          AI
        </span>
      );
    }
    return null;
  };

  if (showAnalysis && analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Conversation Analysis
                </h1>
              </div>
              <button
                onClick={resetChat}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Overall Sentiment */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Overall Conversation Sentiment
              </h2>
              <div className="flex items-center gap-4">
                <span
                  className={`text-4xl font-bold ${getSentimentColor(
                    analysis.overall_sentiment
                  )}`}
                >
                  {analysis.overall_sentiment}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Confidence</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        analysis.overall_sentiment === "Positive"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${analysis.positive_ratio * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {analysis.positive_count} positive,{" "}
                    {analysis.negative_count} negative messages
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Trend */}
            {analysis.sentiment_trend && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sentiment Trend
                </h2>
                <p className="text-gray-700">{analysis.sentiment_trend}</p>
              </div>
            )}

            {/* Individual Messages */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Message-by-Message Analysis
              </h2>
              <div className="space-y-4">
                {analysis.message_sentiments.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          User Message #{index + 1}
                        </div>
                        <p className="text-gray-800">{item.message}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentBgColor(
                          item.sentiment
                        )} ${getSentimentColor(item.sentiment)}`}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetChat}
              className="mt-8 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start New Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentIcon = chatModes[chatMode].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "85vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  Sentiment Analysis Chatbot
                </h1>
                <p className="text-blue-100 text-sm">
                  Chat with AI and analyze your conversation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold"
                >
                  <CurrentIcon className="w-4 h-4" />
                  <span>{chatModes[chatMode].label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showModeDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                    {Object.entries(chatModes).map(([key, mode]) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setChatMode(key);
                            setShowModeDropdown(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors ${
                            chatMode === key ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className={`${mode.bgColor} p-2 rounded-lg`}>
                            <Icon className={`w-5 h-5 ${mode.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`font-semibold ${mode.color}`}>
                              {mode.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {mode.description}
                            </div>
                          </div>
                          {chatMode === key && (
                            <div className="text-blue-600 text-xl">✓</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {messages.length > 0 && !isChatEnded && (
                <button
                  onClick={endChat}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold"
                >
                  End Chat
                </button>
              )}
              {isChatEnded && (
                <button
                  onClick={analyzeConversation}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  View Analysis
                </button>
              )}
            </div>
          </div>

          {/* Mode Indicator Bar */}
          <div
            className={`mt-4 px-3 py-2 ${chatModes[chatMode].bgColor} rounded-lg flex items-center gap-2`}
          >
            <CurrentIcon className={`w-4 h-4 ${chatModes[chatMode].color}`} />
            <span
              className={`text-sm font-medium ${chatModes[chatMode].color}`}
            >
              {chatModes[chatMode].description}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Start a conversation to begin</p>
                <p className="text-sm mt-2">
                  Current mode:{" "}
                  <span className="font-semibold">
                    {chatModes[chatMode].label}
                  </span>
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : msg.type === "system"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="whitespace-pre-wrap break-words flex-1">
                    {msg.content}
                  </p>
                  {msg.role === "assistant" && getMessageBadge(msg.type)}
                </div>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-gray-50">
          {isChatEnded ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">
                Chat has ended. Click "View Analysis" to see results.
              </p>
              <button
                onClick={resetChat}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || isChatEnded}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim() || isChatEnded}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
