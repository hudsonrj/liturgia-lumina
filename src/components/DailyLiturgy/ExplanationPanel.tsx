
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VolumeIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExplanationPanelProps {
  explanation: {
    type: string;
    data: {
      explanation: string;
      practicalEffects: string;
      examples: string[];
    };
  };
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
  onReadAloud: () => void;
  isLoadingSpeech: boolean;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  expandedSection,
  onToggleSection,
  onReadAloud,
  isLoadingSpeech
}) => {
  return (
    <div className="mt-8 animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-liturgy-gold/20">
      <h3 className="text-xl font-title text-liturgy-burgundy mb-4">Explicação</h3>
      
      <div className="space-y-4">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => onToggleSection('explanation')}
              className="w-full justify-between text-left font-handwriting text-lg md:text-xl text-liturgy-purple"
            >
              <span>Significado Teológico</span>
              <span>{expandedSection === 'explanation' ? '−' : '+'}</span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            {expandedSection === 'explanation' && (
              <div className="p-4 liturgy-text font-script">
                {explanation.data.explanation}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        <Separator />
        
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => onToggleSection('practical')}
              className="w-full justify-between text-left font-handwriting text-lg md:text-xl text-liturgy-purple"
            >
              <span>Aplicação Prática</span>
              <span>{expandedSection === 'practical' ? '−' : '+'}</span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            {expandedSection === 'practical' && (
              <div className="p-4 liturgy-text font-script">
                {explanation.data.practicalEffects}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        <Separator />
        
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => onToggleSection('examples')}
              className="w-full justify-between text-left font-handwriting text-lg md:text-xl text-liturgy-purple"
            >
              <span>Exemplos Concretos</span>
              <span>{expandedSection === 'examples' ? '−' : '+'}</span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            {expandedSection === 'examples' && (
              <div className="p-4 liturgy-text">
                <ul className="list-disc pl-5 space-y-2 font-script">
                  {explanation.data.examples.map((example: string, i: number) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={onReadAloud}
          disabled={isLoadingSpeech}
          className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
        >
          <VolumeIcon className="mr-2 h-4 w-4" />
          Ouvir Explicação
        </Button>
      </div>
    </div>
  );
};

export default ExplanationPanel;
