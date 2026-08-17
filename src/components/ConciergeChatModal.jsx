import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Watch, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function ConciergeChatModal({
  isOpen,
  onClose,
  allProducts,
  onSelectWatch,
  lang,
  currency
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'concierge',
      text: isAr 
        ? "أهلاً بك في دار HOROLOGY الفاخرة. أنا مستشارك الساعاتي الخاص. كيف يمكنني مساعدتك في اختيار قطعتك الاستثنائية اليوم؟" 
        : "Welcome to HOROLOGY Haute Atelier. I am your personal horology concierge. How may I assist you in acquiring your signature timepiece today?",
      suggestedProducts: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    {
      label: isAr ? 'ساعة فاخرة للمناسبات الرسمية' : 'Dress watch for black-tie galas',
      query: 'luxury dress'
    },
    {
      label: isAr ? 'ساعة غوص رياضية عالية المقاومة' : 'Professional diver / sports timepiece',
      query: 'diver sports'
    },
    {
      label: isAr ? 'تحفة توربيون نادرة للمقتنين' : 'Rare collector tourbillon masterpiece',
      query: 'automatic tourbillon'
    },
    {
      label: isAr ? 'ساعات سباق كرونوغراف أيقونية' : 'Iconic chronograph racing watches',
      query: 'chronograph racing'
    }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // User Message
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Concierge Intelligence Logic
    setTimeout(() => {
      let matchedWatches = [];
      let responseText = "";

      const lower = text.toLowerCase();

      if (lower.includes('غوص') || lower.includes('diver') || lower.includes('sport') || lower.includes('رياض')) {
        matchedWatches = allProducts.filter(p => p.category === 'diver').slice(0, 2);
        responseText = isAr
          ? "يسعدني ترشيح نخبة ساعات الغوص المصنوعة لمقاومة الأعماق حتى 300 متر مع إطارات سيراميكية وهياكل من التيتانيوم والكاربوتيك:"
          : "I highly recommend our extreme marine instruments, engineered to withstand 300m ocean depth with Cerachrom ceramic bezels and titanium casings:";
      } else if (lower.includes('توربيون') || lower.includes('مقتن') || lower.includes('tourbillon') || lower.includes('collector') || lower.includes('rare')) {
        matchedWatches = allProducts.filter(p => p.isLimited || p.category === 'automatic').slice(0, 2);
        responseText = isAr
          ? "إليك أرقى التحف الساعاتية الميكانيكية ذات الإصدارات المحدودة المصنوعة بأيدي كبار صانعي الساعات السويسرية واليابانية:"
          : "Here are our most prestigious limited-edition horological masterpieces, crafted with high complications and perpetual calibers:";
      } else if (lower.includes('سباق') || lower.includes('كرونوغراف') || lower.includes('chronograph') || lower.includes('racing') || lower.includes('moon')) {
        matchedWatches = allProducts.filter(p => p.category === 'chronograph').slice(0, 2);
        responseText = isAr
          ? "إليك أساطير السباقات والهبوط على القمر، المزودة بكرونوغراف دقيق وعجلات عمودية عالية السرعة:"
          : "Discover our iconic racing & lunar chronograph benchmarks, engineered with column-wheel precision:";
      } else {
        matchedWatches = allProducts.slice(0, 2);
        responseText = isAr
          ? "لقد اخترت لك هذه الساعات الاستثنائية التي تجمع بين الفخامة المطلقة والعيار السويسري المعتمد كرونومتر فائق:"
          : "Allow me to present our most celebrated flagship timepieces, marrying timeless elegance with certified master chronometer precision:";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'concierge',
          text: responseText,
          suggestedProducts: matchedWatches
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl glass-panel sm:rounded-3xl border-amber-500/40 shadow-2xl overflow-hidden sm:my-8 min-h-screen sm:min-h-0 flex flex-col h-[650px] text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 bg-[#0d1017] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center text-amber-400">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                {isAr ? 'مستشار الساعات الفاخرة الذكي (VIP Concierge)' : 'Executive Horology Concierge'}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold block">
                {isAr ? 'متصل الآن • استشارات شخصية على مدار الساعة' : 'Online • 24/7 Private Bespoke Consultation'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'concierge' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-3 max-w-[82%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-black font-semibold rounded-br-none'
                    : 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Suggested Watch Cards if present */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 w-full">
                    {msg.suggestedProducts.map((watch) => (
                      <div
                        key={watch.id}
                        onClick={() => {
                          onSelectWatch(watch);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-neutral-900 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-3 cursor-pointer group shadow-lg"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#141824] p-1 flex items-center justify-center flex-shrink-0">
                          <img src={watch.image} alt={watch.name[lang]} className="max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">{watch.brand}</span>
                          <h5 className="text-[11px] font-bold text-white truncate group-hover:text-amber-300">{watch.name[lang]}</h5>
                          <span className="text-xs font-black text-amber-400 font-serif-luxury">${watch.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.label)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-amber-300 whitespace-nowrap transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-[#0d1017] border-t border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isAr ? "اكتب سؤالك لمستشار الساعات (مثال: أريد ساعة كلاسيكية بسوار جلد)..." : "Ask your horology concierge (e.g. recommend a dress watch with leather strap)..."}
            className="flex-1 bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />

          <button
            type="submit"
            className="p-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
