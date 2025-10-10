import React from 'react';
import { Button } from '@/components/ui/button';

interface ReadingContentProps {
  text: string;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

const ReadingContent: React.FC<ReadingContentProps> = ({
  text,
  isExpanded,
  onToggleExpansion
}) => {
  // Ensure text is a string and not undefined or null
  const safeText = text || '';
  const paragraphs = safeText.split('\n').filter(p => p.trim() !== '');
  
  // Se não houver parágrafos, exibe mensagem
  if (paragraphs.length === 0) {
    return (
      <div className="liturgy-text">
        <p className="mb-4 font-script text-gray-500 italic">Texto não disponível</p>
      </div>
    );
  }

  // Determina quantos parágrafos mostrar
  const visibleParagraphs = isExpanded 
    ? paragraphs 
    : paragraphs.slice(0, Math.min(2, paragraphs.length));
  
  return (
    <div className="liturgy-text">
      <div>
        {visibleParagraphs.map((paragraph, i) => (
          <p 
            key={i} 
            className="mb-4 font-script"
          >
            {paragraph}
          </p>
        ))}
      </div>
      
      {paragraphs.length > 2 && (
        <div className="text-center mt-2">
          <Button 
            variant="link" 
            onClick={onToggleExpansion}
            className="font-handwriting text-liturgy-burgundy hover:text-liturgy-gold"
          >
            {isExpanded ? 'Recolher leitura' : 'Ver leitura completa'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReadingContent;
