import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Cpu, Zap, Send, Bot, User, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Message {
    role: 'user' | 'ai'
    content: string
}

const CommandHub: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Command Hub AI Online. Systems Nominal. How can I assist you with city management today?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            })

            const data = await response.json()
            const aiMessage: Message = { role: 'ai', content: data.response }
            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = { role: 'ai', content: 'Connection to AI Core interrupted. Please try again.' }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-purple-100 dark:bg-purple-500/10 mb-6 border border-purple-200 dark:border-purple-500/20">
                        <Brain className="text-purple-600 dark:text-purple-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-200 dark:to-pink-500 mb-6 text-glow">
                        AI Command Hub
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        A centralized neural network that orchestrates city-wide climate responses, processing millions of data points to make split-second decisions for urban safety.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Cpu className="mr-3 text-purple-600 dark:text-purple-400" /> Neural Orchestration
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            The Command Hub acts as the city's brain. It ingests data from satellite feeds, ground sensors, and weather stations. Using deep reinforcement learning, it optimizes the deployment of resources—activating pumps before floods occur or triggering cooling systems ahead of heatwaves.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                                Real-time decision latency &lt; 50ms
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                                Predictive resource allocation
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                                Autonomous emergency response protocols
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col h-[600px]"
                    >
                        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Bot className="mr-3 text-pink-500 dark:text-pink-400" /> AI Assistant
                            </h2>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider">Online</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 text-gray-900 dark:text-white rounded-tr-none'
                                        : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-tl-none'
                                        }`}>
                                        <div className="flex items-center mb-1 opacity-50 text-xs uppercase tracking-wider">
                                            {msg.role === 'user' ? <User size={12} className="mr-1" /> : <Bot size={12} className="mr-1" />}
                                            {msg.role === 'user' ? 'You' : 'System'}
                                        </div>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-2xl rounded-tl-none p-4 flex items-center">
                                        <Loader size={16} className="animate-spin mr-2 text-purple-600 dark:text-purple-400" />
                                        Processing query...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Enter command or query..."
                                className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-4 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Zap className="mr-2" /> Access Main Terminal
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CommandHub
