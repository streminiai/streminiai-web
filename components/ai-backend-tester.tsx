"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Terminal, AlertCircle, CheckCircle2, Loader2, ChevronRight } from "lucide-react"
import { sendBackendRequest, BackendEndpoint, BackendResponse } from "@/lib/api"

const endpoints: { label: string; value: BackendEndpoint }[] = [
    { label: "Chat", value: "chat" },
    { label: "Keyboard", value: "keyboard" },
    { label: "Automation", value: "automation" },
    { label: "Security", value: "security" },
    { label: "Translation", value: "translation" },
    { label: "Image", value: "image" },
]

export function AIBackendTester() {
    const [endpoint, setEndpoint] = useState<BackendEndpoint>("chat")
    const [jsonBody, setJsonBody] = useState('{\n  "message": "Hello AI"\n}')
    const [response, setResponse] = useState<BackendResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSend = async () => {
        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            let parsedBody: Record<string, unknown> = {}
            try {
                parsedBody = JSON.parse(jsonBody)
            } catch {
                throw new Error("Invalid JSON body")
            }

            const res = await sendBackendRequest(endpoint, parsedBody)
            setResponse(res)
            if (res.status === "error") {
                setError(res.error || "Backend returned an error")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Request Panel */}
                <div className="flex-1 space-y-4">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-purple-400" />
                            Request Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Endpoint</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {endpoints.map((ep) => (
                                        <button
                                            key={ep.value}
                                            onClick={() => setEndpoint(ep.value)}
                                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${endpoint === ep.value
                                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                                }`}
                                        >
                                            /{ep.value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">JSON Body</label>
                                <textarea
                                    value={jsonBody}
                                    onChange={(e) => setJsonBody(e.target.value)}
                                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-purple-300 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    spellCheck={false}
                                />
                            </div>

                            <motion.button
                                onClick={handleSend}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {loading ? "Sending..." : "Send Request"}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Response Panel */}
                <div className="flex-1 space-y-4">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                            Response
                        </h3>

                        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto font-mono text-sm min-h-[300px]">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                    <p>Waiting for response...</p>
                                </div>
                            ) : response ? (
                                <pre className="text-blue-300 whitespace-pre-wrap">
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            ) : error ? (
                                <div className="flex items-start gap-3 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                    <Terminal className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No request sent yet</p>
                                </div>
                            )}
                        </div>

                        {response && !error && (
                            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Request successful</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
