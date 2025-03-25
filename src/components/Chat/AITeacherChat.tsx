
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAIServices } from '../../hooks/useAIServices';
import { toast } from '@/lib/toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AITeacherChatProps {
  liturgicalContext?: string;
}

const AITeacherChat: React.FC<AITeacherChatProps> = ({ liturgicalContext = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { explainReading } = useAIServices();
  
  // Adicionar mensagem de boas-vindas quando o chat é aberto pela primeira vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        content: 'Olá! Sou seu professor de fé e estou aqui para ajudar em sua jornada espiritual. Posso explicar as leituras da semana, responder perguntas sobre a fé católica ou simplesmente conversar sobre sua caminhada espiritual. Como posso ajudar hoje?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Scroll para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Utilizar o serviço de explicação de leitura existente para gerar respostas
      // Isto é uma simplificação, no mundo real você teria um serviço dedicado para o chat
      const aiResponse = await explainReading(input, liturgicalContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 100).toString(),
        content: aiResponse.explanation || 'Desculpe, não consegui processar sua pergunta. Poderia reformulá-la?',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      toast.error('Houve um erro ao processar sua mensagem. Por favor, tente novamente.');
      
      const errorMessage: Message = {
        id: (Date.now() + 100).toString(),
        content: 'Desculpe, estou com dificuldades para responder agora. Poderia tentar novamente mais tarde?',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-liturgy-gold hover:bg-liturgy-gold/90 border-liturgy-burgundy"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] max-h-[80vh] rounded-t-xl">
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-handwriting text-liturgy-burgundy">Professor de Fé</h2>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          
          <ScrollArea className="flex-1 mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-liturgy-gold/10 text-liturgy-burgundy' 
                        : 'bg-liturgy-burgundy/10 text-liturgy-burgundy'
                    }`}
                  >
                    <p className="font-handwriting text-lg">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 font-handwriting"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AITeacherChat;
