"use client"

import { useState } from "react"
import { Eye, Code } from "lucide-react"

interface BlogEditorProps {
    value: string
    onChange: (_value: string) => void
    placeholder?: string
}

export function BlogEditor({ value, onChange, placeholder = "Write your blog content here..." }: BlogEditorProps) {
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

    // Simple markdown to HTML conversion (basic)
    const renderMarkdown = (markdown: string) => {
        const html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold mt-6 mb-3">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-semibold mt-8 mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-10 mb-5">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline">$1</a>')
            // Lists
            .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/(<li.*<\/li>)/gim, '<ul class="my-4">$1</ul>')
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto"><code>$1</code></pre>')
            // Inline code
            .replace(/`(.*?)`/gim, '<code class="bg-slate-900 px-1 rounded font-mono text-sm">$1</code>')
            // Line breaks
            .replace(/\n/gim, '<br />')

        return html
    }

    return (
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
            <div className="border-b border-slate-700 px-4 py-2 bg-slate-900/50 flex gap-2">
                <button
                    onClick={() => setActiveTab("write")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "write" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Code className="w-4 h-4" />
                    Write
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Eye className="w-4 h-4" />
                    Preview
                </button>
            </div>

            {activeTab === "write" ? (
                <>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full min-h-[400px] bg-slate-800 text-white p-4 focus:outline-none resize-none font-mono text-sm"
                    />
                    <div className="px-4 py-2 text-xs text-slate-400 bg-slate-900/50 border-t border-slate-700">
                        <strong>Markdown supported:</strong> # Headers, **bold**, *italic*, [links](url)
                    </div>
                </>
            ) : (
                <div
                    className="min-h-[400px] p-6 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-slate-400">Nothing to preview yet...</p>' }}
                />
            )}
        </div>
    )
}
