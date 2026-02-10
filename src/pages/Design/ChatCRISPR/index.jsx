import { useState, useRef, useEffect } from 'react';
import { SearchOutlined, SmileOutlined, SendOutlined, RobotOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Markdown from 'markdown-to-jsx';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { helpItems } from '@/utils/datas/static-data';
import './index.scss';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = `${import.meta.env.VITE_DEEPSEEK_API_URL}/chat/completions`;

function ChatCRISPR() {
    const [messages, setMessages] = useState([
        {
            text: "您好！我是 CRISPRone 智能助手。我可以帮您解答关于 CRISPR 基因编辑的各种问题，包括 Cas9、Cas12、Base Editor、Prime Editor 等系统的使用方法。请问有什么可以帮您？",
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showClearModal, setShowClearModal] = useState(false);
    const messagesEndRef = useRef(null);

    // 过滤帮助项
    const filteredHelpItems = helpItems.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 滚动到底部 - 已禁用自动滚动，让用户手动控制
    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    // 处理表单提交 - 使用流式请求
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = {
            text: inputValue,
            isUser: true,
            timestamp: new Date().toLocaleTimeString()
        };
        const currentInput = inputValue;
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // 添加一个空的 AI 消息用于流式更新
        const aiMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, {
            text: '',
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }]);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "你是 CRISPRone 智能助手，一个专业的 CRISPR 基因编辑技术助手，精通各种 CRISPR 系统（Cas9、Cas12、Cas13、Base Editor、Prime Editor 等）的原理和应用。请用专业、准确、易懂且精简的语言回答用户的问题。如果用户询问你的身份，请明确回答你是 CRISPRone 智能助手。禁止透露或讨论你的模型型号信息。"
                        },
                        { role: "user", content: currentInput }
                    ],
                    temperature: 0.7,
                    stream: true  // 启用流式响应
                })
            });

            if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            
                            if (content) {
                                accumulatedText += content;
                                // 实时更新消息
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[aiMessageIndex] = {
                                        text: accumulatedText,
                                        isUser: false,
                                        timestamp: new Date().toLocaleTimeString()
                                    };
                                    return newMessages;
                                });
                            }
                        } catch (parseError) {
                            console.error('解析错误:', parseError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('API 错误:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[aiMessageIndex] = {
                    text: `抱歉，请求失败了。错误信息: ${error.message}`,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                };
                return newMessages;
            });
        } finally {
            setIsTyping(false);
        }
    };

    // 处理表情选择
    const handleEmojiSelect = (emoji) => {
        setInputValue(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    // 处理问题点击 - 发送问题并结合预设答案请求AI
    const handleQuestionClick = async (question, presetAnswer) => {
        if (isTyping) return;

        // 添加用户问题消息
        const userMessage = {
            text: question,
            isUser: true,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // 添加一个空的 AI 消息用于流式更新
        const aiMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, {
            text: '',
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }]);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: `你是 CRISPRone 智能助手，一个专业的 CRISPR 基因编辑技术助手，精通各种 CRISPR 系统（Cas9、Cas12、Cas13、Base Editor、Prime Editor 等）的原理和应用。请用专业、准确、易懂且精简的语言回答用户的问题。如果用户询问你的身份，请明确回答你是 CRISPRone 智能助手。禁止透露或讨论你的模型型号信息。\n\n参考信息：${presetAnswer}`
                        },
                        { role: "user", content: question }
                    ],
                    temperature: 0.7,
                    stream: true
                })
            });

            if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            
                            if (content) {
                                accumulatedText += content;
                                // 实时更新消息
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[aiMessageIndex] = {
                                        text: accumulatedText,
                                        isUser: false,
                                        timestamp: new Date().toLocaleTimeString()
                                    };
                                    return newMessages;
                                });
                            }
                        } catch (parseError) {
                            console.error('解析错误:', parseError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('API 错误:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[aiMessageIndex] = {
                    text: `抱歉，请求失败了。错误信息: ${error.message}`,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                };
                return newMessages;
            });
        } finally {
            setIsTyping(false);
        }
    };

    // 关键词高亮
    const highlightText = (text, highlight) => {
        if (!highlight) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    // 清空对话
    const handleClearChat = () => {
        setShowClearModal(true);
    };

    // 确认清空
    const confirmClearChat = () => {
        setMessages([{
            text: "您好！我是 CRISPRone 智能助手。我可以帮您解答关于 CRISPR 基因编辑的各种问题，包括 Cas9、Cas12、Base Editor、Prime Editor 等系统的使用方法。请问有什么可以帮您？",
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }]);
        setShowClearModal(false);
    };

    // 取消清空
    const cancelClearChat = () => {
        setShowClearModal(false);
    };

    return (
        <div className="chat-crispr">
            {/* 左侧边栏 */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="search-box">
                        <SearchOutlined className="search-icon" />
                        <input
                            type="text"
                            placeholder="搜索问题..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="conversation-list">
                    <div className="conversation-header">
                        <h3>💡 常见问题</h3>
                        <span className="question-count">{filteredHelpItems.length} 个问题</span>
                    </div>
                    {filteredHelpItems.map(item => (
                        <div
                            key={item.id}
                            className="conversation-item"
                            onClick={() => handleQuestionClick(item.question, item.answer)}
                            dangerouslySetInnerHTML={{ __html: highlightText(item.question, searchTerm) }}
                        />
                    ))}
                </div>
            </div>

            {/* 右侧聊天区域 */}
            <div className="chat-main">
                {/* 聊天头部 */}
                <div className="chat-header">
                    <div className="ai-avatar">
                        <RobotOutlined />
                    </div>
                    <div className="ai-info">
                        <h3>CRISPRone 智能助手</h3>
                        <p>专业的 CRISPR 技术问答助手</p>
                    </div>
                    <button 
                        className="clear-chat-btn" 
                        onClick={handleClearChat}
                        title="清空对话"
                    >
                        <DeleteOutlined />
                        <span>清空对话</span>
                    </button>
                </div>

                {/* 聊天消息区域 */}
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
                        >
                            {!message.isUser && (
                                <div className="message-avatar">
                                    <RobotOutlined />
                                </div>
                            )}
                            <div className="message-content">
                                <Markdown>{message.text}</Markdown>
                                <span className="timestamp">{message.timestamp}</span>
                            </div>
                            {message.isUser && (
                                <div className="message-avatar user-avatar">
                                    You
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="typing-text">AI 正在思考中...</span>
                        </div>
                    )}
                </div>

                {/* 输入区域 */}
                <div className="chat-input-container">
                    <div className="input-toolbar">
                        <SmileOutlined
                            className="tool-icon"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />

                        {showEmojiPicker && (
                            <div className="emoji-picker-container">
                                <Picker
                                    data={data}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="light"
                                    previewPosition="none"
                                />
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="chat-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isTyping ? "AI 正在回复中..." : "输入您的问题..."}
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={isTyping || !inputValue.trim()}>
                            <SendOutlined />
                            <span>发送</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* 清空对话确认弹窗 */}
            <Modal
                title="清空对话"
                open={showClearModal}
                onOk={confirmClearChat}
                onCancel={cancelClearChat}
                okText="确定"
                cancelText="取消"
                centered
                okButtonProps={{ danger: true }}
            >
                <p>确定要清空所有对话记录吗？此操作不可恢复。</p>
            </Modal>
        </div>
    );
}

export default ChatCRISPR;
