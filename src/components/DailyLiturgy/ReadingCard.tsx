import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, VolumeIcon } from 'lucide-react';
import ReadingContent from './ReadingContent';
import { Reading, PsalmReading } from '../../services/liturgicalService';

interface ReadingCardProps {
  reading: Reading | PsalmReading;
  type: 'first' | 'psalm' | 'second' | 'gospel';
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onExplain: () => void;
  onReadAloud: () => void;
  isLoadingExplanation: boolean;
  isLoadingSpeech: boolean;
}

const extractBibleReference = (reference: string) => {
  // Exemplos de referências: "At 2,1-11", "Sl 103(104)", "1Cor 12,3b-7.12-13", "Jo 20,19-23"
  const match = reference.match(/^([1-3]?\s*[A-Za-zÀ-ú]+)\s*(\d+)/);
  if (match) {
    const [_, bookAbbrev, chapter] = match;
    // Remove espaços extras e retorna a abreviação e o capítulo
    return { book: bookAbbrev.replace(/\s+/g, ''), chapter: parseInt(chapter) };
  }
  return null;
};

const ReadingCard: React.FC<ReadingCardProps> = ({
  reading,
  type,
  isExpanded,
  onToggleExpansion,
  onExplain,
  onReadAloud,
  isLoadingExplanation,
  isLoadingSpeech
}) => {
  const navigate = useNavigate();
  const isPsalm = type === 'psalm';
  const psalmReading = reading as PsalmReading;
  
  const handleReferenceClick = () => {
    const reference = extractBibleReference(reading.referencia);
    if (reference) {
      navigate(`/bible?book=${reference.book}&chapter=${reference.chapter}`);
    }
  };
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
      <CardHeader>
        <CardTitle 
          className="font-title text-liturgy-burgundy cursor-pointer hover:text-liturgy-gold transition-colors"
          onClick={handleReferenceClick}
        >
          {reading.referencia}
        </CardTitle>
        <CardDescription>
          {isPsalm 
            ? <span className="font-medium text-liturgy-purple italic font-handwriting">{psalmReading.refrao || ""}</span>
            : (reading as Reading).titulo || ""
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[100px]"> {/* Altura mínima para evitar saltos */}
          <ReadingContent 
            text={reading.texto} 
            isExpanded={isExpanded} 
            onToggleExpansion={onToggleExpansion} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onExplain}
          disabled={isLoadingExplanation}
          className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
        >
          <Info className="mr-2 h-4 w-4" />
          Explicar
        </Button>
        <Button
          variant="outline"
          onClick={onReadAloud}
          disabled={isLoadingSpeech}
          className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
        >
          <VolumeIcon className="mr-2 h-4 w-4" />
          Ouvir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReadingCard;
