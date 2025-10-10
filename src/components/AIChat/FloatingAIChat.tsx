import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Minimize, Maximize } from 'lucide-react';
import { useLiturgicalData } from '@/hooks/useLiturgicalData';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('ai-chat-messages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: '1',
        content: 'Olá! Sou seu professor de liturgia. Como posso ajudar em sua jornada espiritual hoje?',
        sender: 'ai',
        timestamp: new Date()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: liturgicalData } = useLiturgicalData(new Date());
  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
  }, [messages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get context from liturgical data
      const context = liturgicalData ? {
        date: liturgicalData.data,
        liturgy: liturgicalData.liturgia,
        readings: {
          firstReading: liturgicalData.leituras.primeiraLeitura?.[0]?.referencia,
          gospel: liturgicalData.leituras.evangelho?.[0]?.referencia
        },
        saints: liturgicalData.saints
      } : {};
      
      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse = generateAIResponse(inputValue, context, messages);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsLoading(false);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, tive um problema ao processar sua mensagem. Poderia tentar novamente?',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Simple AI response generator (placeholder for actual AI service)
  const generateAIResponse = (userInput: string, context: any, messageHistory: Message[]): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Simple pattern matching for demonstration
    if (userInputLower.includes('leitura') || userInputLower.includes('evangelho')) {
      return `As leituras de hoje são muito significativas. ${context.readings?.firstReading ? `A primeira leitura é ${context.readings.firstReading}` : ''} ${context.readings?.gospel ? `e o Evangelho é ${context.readings.gospel}` : ''}. Estas leituras nos convidam a refletir sobre nossa fé e como vivê-la no dia a dia.`;
    }
    
    if (userInputLower.includes('santo') || userInputLower.includes('festa')) {
      return `Hoje ${context.saints && context.saints.length > 0 ? `celebramos ${context.saints.join(', ')}. ` : 'não temos uma celebração específica de santos. '} Cada santo nos oferece um exemplo único de como viver o Evangelho em diferentes contextos e épocas.`;
    }
    
    if (userInputLower.includes('oração') || userInputLower.includes('rezar')) {
      return 'A oração é nosso diálogo com Deus. Recomendo começar com um momento de silêncio, reconhecendo a presença de Deus. Depois, você pode expressar gratidão, pedir perdão, interceder pelos outros e pedir ajuda para suas necessidades. Termine agradecendo a Deus por ouvi-lo.';
    }
    
    if (userInputLower.includes('bíblia') || userInputLower.includes('escritura')) {
      return 'A Bíblia é a Palavra de Deus e contém tudo o que precisamos para nossa salvação. Para uma leitura frutífera, recomendo a Lectio Divina: leia uma passagem lentamente, medite sobre ela, ore com as palavras que tocaram seu coração e contemple o que Deus está lhe dizendo.';
    }
    
    // Default response
    return 'Como seu professor de liturgia, estou aqui para ajudá-lo a entender melhor as leituras, os rituais e as tradições da Igreja. Há algo específico sobre a liturgia de hoje que gostaria de saber?';
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={toggleChat} 
              className="h-12 w-12 rounded-full bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white shadow-lg"
              type="button"
            >
              <MessageCircle size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={5}>
            <p>Converse com seu professor de liturgia</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isOpen && (
        <Card className={`absolute bottom-16 right-0 w-80 md:w-96 shadow-xl transition-all duration-300 ease-in-out ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-liturgy-gold">
                <span className="text-white font-bold">P</span>
              </Avatar>
              <div className="font-medium">Professor de Liturgia</div>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMinimize} 
                className="h-8 w-8 rounded-full"
                type="button"
              >
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat} 
                className="h-8 w-8 rounded-full"
                type="button"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-grow overflow-hidden">
                <ScrollArea className="h-[380px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user' 
                              ? 'bg-liturgy-burgundy text-white' 
                              : 'bg-gray-100'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    type="button"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default FloatingAIChat;