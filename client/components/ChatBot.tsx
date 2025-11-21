import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  RefreshCw,
  Heart,
  ShoppingBag,
  MapPin,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  text: string;
  action: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens for the first time
      const welcomeMessage: Message = {
        id: "1",
        text: "Jambo! 👋 Welcome to Nomad Treasures! I'm Kesi, your personal shopping assistant. I'm here to help you discover authentic treasures from Kenya's nomadic tribes. How can I assist you today?",
        isBot: true,
        timestamp: new Date(),
        quickActions: [
          { text: "Find products by tribe", action: "tribes" },
          { text: "Shipping & delivery", action: "shipping" },
          { text: "Product recommendations", action: "recommendations" },
          { text: "Learn about our story", action: "story" },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const getContextualResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();

    // Tribe-related queries
    if (lowercaseInput.includes("maasai") || lowercaseInput.includes("masai")) {
      return "The Maasai are renowned for their intricate beadwork and vibrant jewelry! Each color has special meaning - red represents bravery, blue symbolizes energy, and white stands for peace. Our Maasai collection features authentic necklaces, bracelets, and traditional shukas. Would you like to see our Maasai products?";
    }

    if (lowercaseInput.includes("turkana")) {
      return "The Turkana people are master weavers and potters from northwestern Kenya. Their baskets are not just beautiful but tell stories of their pastoral lifestyle. Each basket takes days to weave using traditional sisal and palm techniques. Check out our Turkana collection for authentic baskets and pottery!";
    }

    if (lowercaseInput.includes("samburu")) {
      return "The Samburu, cousins to the Maasai, create stunning traditional clothing and textiles. Their colorful wraps and beaded ornaments reflect their rich cultural heritage. Our Samburu collection features traditional fabrics and handcrafted accessories.";
    }

    if (lowercaseInput.includes("rendile")) {
      return "The Rendile are skilled artisans known for their beautiful wood carvings and traditional tools. Living in Kenya's northern desert, they create functional art that reflects their nomadic lifestyle. Our Rendile collection includes carved bowls, utensils, and ceremonial items.";
    }

    if (lowercaseInput.includes("borana")) {
      return "The Borana people have a rich musical heritage and create traditional instruments for their ceremonies. Their crafts often incorporate elements of their complex Gada calendar system. Explore our Borana collection for drums, ceremonial items, and coffee accessories!";
    }

    if (lowercaseInput.includes("somali")) {
      return "Somali artisans create beautiful textiles, incense burners, and home décor that blend Islamic heritage with traditional African aesthetics. Their woven mats and decorative containers are both functional and beautiful. Browse our Somali collection!";
    }

    // Product category queries
    if (
      lowercaseInput.includes("jewelry") ||
      lowercaseInput.includes("necklace") ||
      lowercaseInput.includes("bracelet")
    ) {
      return "Our jewelry collection features authentic beaded pieces from various tribes, each with cultural significance. Maasai jewelry is particularly popular, with intricate beadwork that tells stories of age, status, and tribal identity. Prices range from $45-$340. Would you like to see our jewelry collection?";
    }

    if (
      lowercaseInput.includes("basket") ||
      lowercaseInput.includes("baskets")
    ) {
      return "Our baskets are handwoven by Turkana artisans using traditional techniques passed down through generations. Made from sisal and palm leaves, they're both beautiful and functional. Perfect for home décor or storage! Prices start from $78.";
    }

    if (
      lowercaseInput.includes("clothing") ||
      lowercaseInput.includes("shuka") ||
      lowercaseInput.includes("fabric")
    ) {
      return "Traditional clothing includes Maasai shukas, Samburu wraps, and authentic tribal fabrics. Each piece is handwoven and carries cultural significance. Our clothing collection ranges from $45-$203.";
    }

    // Shipping and practical queries
    if (
      lowercaseInput.includes("shipping") ||
      lowercaseInput.includes("delivery") ||
      lowercaseInput.includes("ship")
    ) {
      return "We offer worldwide shipping! 📦 Orders over $100 qualify for free shipping. Standard delivery takes 5-7 business days globally. We ship from Kenya using secure, tracked delivery. All items are carefully packaged to ensure they arrive safely.";
    }

    if (
      lowercaseInput.includes("price") ||
      lowercaseInput.includes("cost") ||
      lowercaseInput.includes("expensive")
    ) {
      return "Our prices reflect the authentic craftsmanship and fair trade practices. Items range from $45-$340. We support both USD and Kenyan Shillings (KES). Remember, every purchase directly supports artisan families and helps preserve cultural traditions!";
    }

    if (
      lowercaseInput.includes("authentic") ||
      lowercaseInput.includes("genuine") ||
      lowercaseInput.includes("real")
    ) {
      return "All our products are 100% authentic and handcrafted by traditional artisans from nomadic tribes. Each item comes with a certificate of authenticity and the story of the artisan who made it. We work directly with tribal communities to ensure genuine craftsmanship.";
    }

    // Payment queries
    if (
      lowercaseInput.includes("payment") ||
      lowercaseInput.includes("pay") ||
      lowercaseInput.includes("mpesa")
    ) {
      return "We accept secure payments via PayPal and M-Pesa for our Kenyan customers. All transactions are encrypted and protected. You can also save items to your wishlist and checkout when ready!";
    }

    // General help queries
    if (
      lowercaseInput.includes("help") ||
      lowercaseInput.includes("assist") ||
      lowercaseInput.includes("support")
    ) {
      return "I'm here to help you discover the perfect authentic treasures! I can assist with product recommendations, tribal information, shipping details, or answer any questions about our artisans and their crafts. What would you like to know?";
    }

    if (
      lowercaseInput.includes("recommend") ||
      lowercaseInput.includes("suggest") ||
      lowercaseInput.includes("popular")
    ) {
      return "Popular items include our Maasai beaded necklaces ($89), Turkana woven baskets ($156), and Borana drums ($340). For first-time buyers, I recommend starting with jewelry or baskets - they showcase beautiful craftsmanship and make great conversation pieces!";
    }

    // Return policy
    if (
      lowercaseInput.includes("return") ||
      lowercaseInput.includes("exchange") ||
      lowercaseInput.includes("refund")
    ) {
      return "We offer a 30-day return policy for unused items in original condition. Given the handcrafted nature of our products, each piece is unique. If you're not completely satisfied, we'll work with you to find a solution. Contact us for specific return assistance.";
    }

    // Story/mission queries
    if (
      lowercaseInput.includes("story") ||
      lowercaseInput.includes("mission") ||
      lowercaseInput.includes("about")
    ) {
      return "Nomad Treasures was founded to preserve cultural heritage while empowering artisan communities. We work directly with 500+ artisans across 6 tribal communities, ensuring fair compensation and authentic representation. Every purchase helps sustain traditional craftsmanship! 🌍";
    }

    // Default responses for unclear queries
    const greetings = ["hello", "hi", "hey", "jambo"];
    if (greetings.some((greeting) => lowercaseInput.includes(greeting))) {
      return "Jambo! Great to meet you! 😊 I'm excited to help you explore our authentic tribal treasures. Are you looking for something specific, or would you like me to show you our most popular items?";
    }

    // Fallback response
    return "I'd love to help you with that! I can assist with product information, tribal heritage, shipping details, or recommendations. Try asking about specific tribes (Maasai, Turkana, etc.), product categories (jewelry, baskets, clothing), or general questions about shipping and authenticity. What interests you most?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getContextualResponse(inputValue),
          isBot: true,
          timestamp: new Date(),
          quickActions: inputValue.toLowerCase().includes("tribe")
            ? [
                { text: "Maasai Products", action: "maasai" },
                { text: "Turkana Baskets", action: "turkana" },
                { text: "View All Tribes", action: "all-tribes" },
              ]
            : undefined,
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1500,
    );
  };

  const handleQuickAction = (action: string) => {
    let responseText = "";
    switch (action) {
      case "tribes":
        responseText =
          "I can tell you about any of our 6 featured tribes! Each has unique traditions and crafts:";
        break;
      case "shipping":
        responseText = "shipping information";
        break;
      case "recommendations":
        responseText = "product recommendations";
        break;
      case "story":
        responseText = "our story";
        break;
      default:
        responseText = action;
    }
    setInputValue(responseText);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-earth-red hover:bg-earth-red/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-tribal-brown text-sahara-sand px-3 py-1 rounded-lg text-sm whitespace-nowrap animate-bounce">
          Need help? Chat with Kesi! 💬
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-80 transition-all duration-300 ${isMinimized ? "h-16" : "h-96"} shadow-xl border-tribal-brown`}
      >
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-earth-red to-tribal-brown text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-sahara-sand flex items-center justify-center">
                <Bot className="h-5 w-5 text-tribal-brown" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Kesi - Shopping Assistant
                </CardTitle>
                <p className="text-xs text-sahara-sand/80">
                  Tribal Heritage Expert 🇰🇪
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sahara-sand/20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] ${message.isBot ? "order-2" : "order-1"}`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        message.isBot
                          ? "bg-white border border-border text-foreground"
                          : "bg-earth-red text-white"
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      {message.quickActions && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.quickActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickAction(action.action)}
                              className="text-xs bg-olive-green text-white px-2 py-1 rounded hover:bg-olive-green/80 transition-colors"
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      {message.isBot ? (
                        <Bot className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border rounded-lg p-3 text-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-earth-red rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-earth-red rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-earth-red rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        Kesi is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about tribes, products, shipping..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-earth-red"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-earth-red hover:bg-earth-red/90 text-white p-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center mt-2">
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Powered by Kenyan heritage
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
