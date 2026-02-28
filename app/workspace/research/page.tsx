"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, UploadCloud, FileText, Send, 
  Settings, Database, History, ChevronRight, Play, Loader2
} from "lucide-react";

export default function ResearchAgent() {
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: 'Hello! I am your Stremini Research Agent. Upload a document or enter a research query to get started.' }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setIsProcessing(true);

    // Simulate Agent Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: 'I am analyzing your request. Since this is the frontend interface, I am ready to be connected to the Stremini AI backend.' 
      }]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#0f0f11] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/workspace" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-bold text-sm tracking-widest text-blue-500">STREMINI</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</div>
          <nav className="space-y-1 px-2">
            <a href="#" className="flex items-center px-3 py-2 text-sm bg-blue-500/10 text-blue-400 rounded-lg">
              <FileText className="mr-3 h-4 w-4" /> Document Analysis
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
              <Database className="mr-3 h-4 w-4" /> Knowledge Base
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
              <History className="mr-3 h-4 w-4" /> History
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors w-full">
            <Settings className="mr-2 h-4 w-4" /> Agent Settings
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header */}
        <header className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center text-sm">
            <span className="text-gray-400">Workspace</span>
            <ChevronRight className="h-4 w-4 mx-1 text-gray-600" />
            <span className="font-medium text-white">Research Agent</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-400">System Online</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left panel - Upload & Tools */}
          <div className="w-1/3 border-r border-white/10 p-6 flex flex-col bg-[#050505] overflow-y-auto hidden md:flex">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <UploadCloud className="mr-2 h-5 w-5 text-blue-500" /> Data Source
            </h2>
            
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group mb-6">
              <div className="bg-white/5 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-gray-400 group-hover:text-blue-400" />
              </div>
              <p className="text-sm font-medium mb-1">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-500">PDF, TXT, DOCX (Max 10MB)</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Documents</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/5">
                      <FileText className="h-4 w-4 text-blue-400 mr-3" />
                      <span className="text-sm text-gray-300 truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-300 mb-2">Agent Status</h3>
                <p className="text-xs text-gray-400 mb-3">The research agent is ready to parse complex documents and summarize insights.</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center">
                  <Play className="h-3 w-3 mr-2" /> Start Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Right panel - Chat Interface */}
          <div className="flex-1 flex flex-col bg-black">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-[#1a1a1f] border border-white/10 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.role === 'agent' && (
                      <div className="flex items-center mb-2 mb-1">
                        <Search className="h-3 w-3 text-blue-400 mr-2" />
                        <span className="text-xs font-semibold text-blue-400">Research Agent</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl rounded-bl-none p-4 flex items-center space-x-3">
                    <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                    <span className="text-sm text-gray-400">Agent is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
              <div className="relative flex items-center max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the research agent a question..."
                  className="w-full bg-[#15151a] border border-white/10 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="absolute right-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-600">AI can make mistakes. Consider verifying important information.</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
