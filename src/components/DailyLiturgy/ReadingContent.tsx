
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
  const paragraphs = text.split('\n');
  
  return (
    <div className="liturgy-text">
      {/* Sempre mostrar pelo menos os primeiros parágrafos */}
      {paragraphs.slice(0, Math.min(2, paragraphs.length)).map((paragraph, i) => (
        <p key={i} className="mb-4 font-handwriting text-lg">{paragraph}</p>
      ))}
      
      {/* Mostrar parágrafos adicionais quando expandido */}
      {isExpanded && paragraphs.length > 2 && (
        <div className="additional-paragraphs">
          {paragraphs.slice(2).map((paragraph, i) => (
            <p key={i + 2} className="mb-4 font-handwriting text-lg">{paragraph}</p>
          ))}
        </div>
      )}
      
      {/* Botão de expandir/recolher */}
      {paragraphs.length > 2 && (
        <div className="text-center mt-2">
          <Button 
            variant="link" 
            onClick={onToggleExpansion}
            className="font-handwriting text-lg text-liturgy-burgundy hover:text-liturgy-gold"
          >
            {isExpanded ? "Recolher leitura" : "Ver leitura completa"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReadingContent;
