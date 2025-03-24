
import React from 'react';
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
  // Determine if it's a psalm to display refrain
  const isPsalm = type === 'psalm';
  const psalmReading = reading as PsalmReading;
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
      <CardHeader>
        <CardTitle className="font-title text-liturgy-burgundy">
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
        <ReadingContent 
          text={reading.texto} 
          isExpanded={isExpanded} 
          onToggleExpansion={onToggleExpansion} 
        />
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
