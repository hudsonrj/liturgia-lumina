
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
      {isExpanded ? (
        // Show full text
        paragraphs.map((paragraph, i) => (
          <p key={i} className="mb-4 font-script">{paragraph}</p>
        ))
      ) : (
        // Show only the first 2 paragraphs or less
        <>
          {paragraphs.slice(0, Math.min(2, paragraphs.length)).map((paragraph, i) => (
            <p key={i} className="mb-4 font-script">{paragraph}</p>
          ))}
          {paragraphs.length > 2 && (
            <div className="text-center mt-2">
              <Button 
                variant="link" 
                onClick={onToggleExpansion}
                className="font-handwriting text-liturgy-burgundy hover:text-liturgy-gold"
              >
                Ver leitura completa
              </Button>
            </div>
          )}
        </>
      )}
      {isExpanded && paragraphs.length > 2 && (
        <div className="text-center mt-2">
          <Button 
            variant="link" 
            onClick={onToggleExpansion}
            className="font-handwriting text-liturgy-burgundy hover:text-liturgy-gold"
          >
            Recolher leitura
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReadingContent;
