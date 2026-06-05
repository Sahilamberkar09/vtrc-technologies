import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Send,
  User,
  Search,
  Terminal,
  ArrowLeft,
  MessageSquare,
  Activity,
  Cpu,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { userDataContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const MessageView = ({ showChatOnMobile, setShowChatOnMobile }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const { serverUrl } = useContext(userDataContext);

  // 1. Fetch current user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setAuthUser(response.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [serverUrl]);

  // 2. Fetch contacts
  useEffect(() => {
    if (!authUser) return;
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/messages/users`, {
          withCredentials: true,
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      }
    };
    fetchContacts();
  }, [authUser, serverUrl]);

  // 3. Connect Socket
  useEffect(() => {
    if (authUser) {
      const socketInstance = io(serverUrl, {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, serverUrl]);

  // 4. Fetch Messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    let isMounted = true;
    setIsLoadingMessages(true);
    setMessages([]);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/messages/${activeChat._id}`,
          {
            withCredentials: true,
          },
        );
        if (isMounted) {
          setMessages(response.data);
        }
      } catch (error) {
        if (isMounted) console.error("Failed to fetch messages", error);
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    };
    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [activeChat, serverUrl]);

  // 5. Listen for real-time incoming messages
  useEffect(() => {
    if (!socket || !activeChat) return;

    const handleNewMessage = (newMessage) => {
      setMessages((prev) => {
        if (
          newMessage.senderId === activeChat._id ||
          newMessage.receiverId === activeChat._id
        ) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeChat]);

  // 6. Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    try {
      const response = await axios.post(
        `${serverUrl}/api/messages/send/${activeChat._id}`,
        { text: inputText },
        { withCredentials: true },
      );
      setMessages((prev) => [...prev, response.data]);
      setInputText("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-160px)] min-h-[600px] w-full bg-white border border-outline-variant rounded-3xl overflow-hidden relative selection:bg-black/10 font-body">
      {/* 1. CONTACT LIST (Left Sidebar) */}
      <div
        className={`border-r border-outline-variant bg-white flex flex-col z-10 w-full md:w-80 lg:w-96 ${showChatOnMobile ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-8 border-b border-surface-container-low bg-surface-container-low/30 space-y-6">
           <div className="flex items-center gap-3">
              <Cpu size={18} className="text-secondary" />
              <h2 className="font-black text-xs uppercase tracking-widest font-mono text-secondary">Nodes</h2>
           </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-black transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="SEARCH NODE..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant focus:border-black rounded-xl outline-none transition-all text-[10px] font-bold font-mono uppercase tracking-widest placeholder:text-outline-variant"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => {
                setActiveChat(contact);
                setShowChatOnMobile(true);
              }}
              className={`p-6 flex items-center space-x-4 cursor-pointer transition-all border-b border-surface-container-low ${
                activeChat?._id === contact._id
                  ? "bg-black text-white"
                  : "hover:bg-surface-container-low text-black"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-sm font-display ${
                    activeChat?._id === contact._id
                      ? "bg-white text-black border-white"
                      : "bg-surface-container-low text-secondary border-outline-variant"
                  } transition-colors`}
                >
                  {contact.name[0].toUpperCase()}
                </div>
                {onlineUsers.includes(contact._id) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase tracking-tight font-display truncate">
                  {contact.name}
                </p>
                <p
                  className={`text-[9px] font-bold uppercase tracking-widest font-mono mt-1 ${
                    activeChat?._id === contact._id
                      ? "text-white/40"
                      : "text-secondary"
                  }`}
                >
                  {onlineUsers.includes(contact._id) ? "Connected" : "Offline"}
                </p>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="p-12 text-center text-secondary text-[10px] font-bold uppercase tracking-widest font-mono">
              No active nodes.
            </div>
          )}
        </div>
      </div>

      {/* 2. CHAT WINDOW (Right Side) */}
      <div
        className={`flex-1 flex flex-col bg-white relative ${showChatOnMobile ? "flex" : "hidden md:flex"}`}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-surface-container-low flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowChatOnMobile(false)}
                  className="md:hidden p-2 text-secondary hover:bg-surface-container-low rounded-xl transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg font-display">
                    {activeChat.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-base text-black font-display uppercase tracking-tight leading-none">
                      {activeChat.name}
                    </h3>
                    <div className="text-[9px] font-bold font-mono flex items-center gap-2 mt-2">
                      {onlineUsers.includes(activeChat._id) ? (
                        <div className="flex items-center gap-1.5 text-green-500">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                           SYNCED
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-secondary">
                           <div className="w-1.5 h-1.5 bg-surface-container-dim rounded-full"></div>
                           OFFLINE
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-container-low text-secondary text-[9px] font-black uppercase tracking-widest font-mono rounded-xl border border-outline-variant">
                <Shield size={12} /> Secure Stream
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6 z-10 flex flex-col custom-scrollbar bg-surface-container-low/30">
              {isLoadingMessages ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                  <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Initializing Stream...</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, index) => {
                    const isMe = msg.senderId === authUser?._id;
                    return (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        layout
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`px-5 py-3.5 rounded-2xl text-sm font-body ${
                              isMe
                                ? "bg-black text-white rounded-tr-none"
                                : "bg-white text-black border border-outline-variant shadow-sm rounded-tl-none"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[9px] font-bold font-mono text-outline-variant mt-2 px-1 uppercase tracking-widest">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-surface-container-low bg-white p-8 z-10">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-4"
              >
                <div className="flex-1 relative group">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-outline-variant group-focus-within:text-black transition-colors">
                      <Terminal size={16} />
                   </div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="ENTER MESSAGE..."
                    className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-black rounded-2xl outline-none text-[11px] font-bold font-mono transition-all uppercase placeholder:text-outline-variant"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-14 h-14 bg-black text-white flex items-center justify-center hover:bg-on-background/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl shadow-xl shadow-black/10 group"
                >
                  <Send size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center z-10 p-12 text-center space-y-6 bg-white">
            <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center text-secondary">
              <MessageCircle size={32} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black font-display uppercase tracking-tight mb-2">
                Secure Channel
              </h2>
              <p className="text-secondary text-[10px] font-bold uppercase tracking-widest font-mono max-w-xs mx-auto leading-relaxed">
                Select an active node to initialize an encrypted communication stream.
              </p>
            </div>
            <div className="pt-6 flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-surface-container-dim rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-surface-container rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageView;
