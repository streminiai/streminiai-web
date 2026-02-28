"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calculator, LineChart, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const agents = [
  {
    id: "research",
    name: "Research Agent",
    description: "Upload papers, analyze documents, and extract deep insights using AI.",
    icon: Search,
    href: "/workspace/research",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    available: true,
  },
  {
    id: "math",
    name: "Math Agent",
    description: "Solve complex equations, graph functions, and get step-by-step solutions.",
    icon: Calculator,
    href: "/workspace/math",
    color: "text-green-400",
    bg: "bg-green-500/10",
    available: false,
  },
  {
    id: "fin",
    name: "Fin Agent",
    description: "Analyze market trends, forecast stocks, and manage financial portfolios.",
    icon: LineChart,
    href: "/workspace/fin",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    available: false,
  },
];

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Stremini <span className="text-blue-500">Workspace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl"
          >
            Select an specialized AI agent to assist you with your tasks.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link href={agent.available ? agent.href : "#"} className={!agent.available ? "cursor-not-allowed" : ""}>
                <div className={`relative flex flex-col h-full p-8 rounded-3xl border ${agent.available ? 'border-white/10 hover:border-blue-500/50 hover:bg-white/[0.02]' : 'border-white/5 opacity-60'} transition-all duration-300 group overflow-hidden bg-black`}>
                  
                  {/* Decorative Gradient Blob */}
                  <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${agent.bg.replace('/10', '')}`} />

                  <div className={`p-4 rounded-2xl w-fit mb-6 ${agent.bg}`}>
                    <agent.icon className={`h-8 w-8 ${agent.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{agent.name}</h3>
                  <p className="text-gray-400 mb-8 flex-grow">{agent.description}</p>
                  
                  <div className="flex items-center text-sm font-medium">
                    {agent.available ? (
                      <span className="text-blue-400 flex items-center group-hover:text-blue-300 transition-colors">
                        Launch Agent <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center bg-white/5 px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
