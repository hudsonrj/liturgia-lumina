import React, { useState, useEffect } from 'react';
import { LiturgicalData } from '../../services/liturgicalService';
import { useAIServices } from '../../hooks/useAIServices';
import { toast } from '@/lib/toast';
import ReadingCard from './ReadingCard';
import ExplanationPanel from './ExplanationPanel';

interface ReadingsTabProps {
  liturgicalData: LiturgicalData;
}

const ReadingsTab: React.FC<ReadingsTabProps> = ({ liturgicalData }) => {
  const { explainReading, speakText, loading, error } = useAIServices();
  const [activeReadingIndex, setActiveReadingIndex] = useState(0);
  const [explanation, setExplanation] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedReadings, setExpandedReadings] = useState<{[key: string]: boolean}>({
    first: false,
    psalm: false,
    second: false,
    gospel: false
  });
  
  // Get the primary readings
  const firstReadings = liturgicalData.leituras.primeiraLeitura || [];
  const psalms = liturgicalData.leituras.salmo || [];
  const secondReadings = liturgicalData.leituras.segundaLeitura || [];
  const gospelReadings = liturgicalData.leituras.evangelho || [];
  
  // Get the active reading based on type and index
  const getActiveReading = (type: 'first' | 'psalm' | 'second' | 'gospel') => {
    switch (type) {
      case 'first':
        return firstReadings[activeReadingIndex] || firstReadings[0];
      case 'psalm':
        return psalms[activeReadingIndex] || psalms[0];
      case 'second':
        return secondReadings[activeReadingIndex] || secondReadings[0];
      case 'gospel':
        return gospelReadings[activeReadingIndex] || gospelReadings[0];
      default:
        return null;
    }
  };
  
  // Reset expanded state when liturgical data changes
  useEffect(() => {
    setExpandedReadings({
      first: false,
      psalm: false,
      second: false,
      gospel: false
    });
  }, [liturgicalData]);

  const handleExplainReading = async (type: 'first' | 'psalm' | 'second' | 'gospel') => {
    const reading = getActiveReading(type);
    if (!reading) return;
    
    try {
      const result = await explainReading(reading.texto, reading.referencia);
      setExplanation({ type, data: result });
      toast.success("Explicação gerada com sucesso!");
    } catch (err) {
      toast.error("Não foi possível gerar a explicação. Tente novamente.");
      console.error("Error explaining reading:", err);
    }
  };
  
  const handleReadAloud = async (text: string) => {
    try {
      await speakText(text);
      toast.success("Leitura iniciada");
    } catch (err) {
      toast.error("Não foi possível iniciar a leitura. Verifique se seu navegador suporta esta função.");
      console.error("Error with text-to-speech:", err);
    }
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const toggleReadingExpansion = (type: 'first' | 'psalm' | 'second' | 'gospel') => {
    setExpandedReadings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleReadExplanationAloud = () => {
    if (!explanation) return;
    
    const explanationText = [
      "Explicação teológica.",
      explanation.data.explanation,
      "Aplicação prática.",
      explanation.data.practicalEffects,
      "Exemplos concretos.",
      ...explanation.data.examples
    ].join(" ");
    
    handleReadAloud(explanationText);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8">
        <div className="relative">
          <h2 className="font-handwriting text-2xl mb-4 text-liturgy-burgundy">Primeira Leitura</h2>
          <ReadingCard
            reading={getActiveReading('first')!}
            type="first"
            isExpanded={expandedReadings.first}
            onToggleExpansion={() => toggleReadingExpansion('first')}
            onExplain={() => handleExplainReading('first')}
            onReadAloud={() => handleReadAloud(getActiveReading('first')?.texto || '')}
            isLoadingExplanation={loading.explanation}
            isLoadingSpeech={loading.speech}
          />
        </div>
        
        <div className="relative">
          <h2 className="font-handwriting text-2xl mb-4 text-liturgy-burgundy">Salmo</h2>
          <ReadingCard
            reading={getActiveReading('psalm')!}
            type="psalm"
            isExpanded={expandedReadings.psalm}
            onToggleExpansion={() => toggleReadingExpansion('psalm')}
            onExplain={() => handleExplainReading('psalm')}
            onReadAloud={() => handleReadAloud(getActiveReading('psalm')?.texto || '')}
            isLoadingExplanation={loading.explanation}
            isLoadingSpeech={loading.speech}
          />
        </div>
        
        {secondReadings.length > 0 && (
          <div className="relative">
            <h2 className="font-handwriting text-2xl mb-4 text-liturgy-burgundy">Segunda Leitura</h2>
            <ReadingCard
              reading={getActiveReading('second')!}
              type="second"
              isExpanded={expandedReadings.second}
              onToggleExpansion={() => toggleReadingExpansion('second')}
              onExplain={() => handleExplainReading('second')}
              onReadAloud={() => handleReadAloud(getActiveReading('second')?.texto || '')}
              isLoadingExplanation={loading.explanation}
              isLoadingSpeech={loading.speech}
            />
          </div>
        )}
        
        <div className="relative">
          <h2 className="font-handwriting text-2xl mb-4 text-liturgy-burgundy">Evangelho</h2>
          <ReadingCard
            reading={getActiveReading('gospel')!}
            type="gospel"
            isExpanded={expandedReadings.gospel}
            onToggleExpansion={() => toggleReadingExpansion('gospel')}
            onExplain={() => handleExplainReading('gospel')}
            onReadAloud={() => handleReadAloud(getActiveReading('gospel')?.texto || '')}
            isLoadingExplanation={loading.explanation}
            isLoadingSpeech={loading.speech}
          />
        </div>
      </div>
      
      {explanation && (
        <ExplanationPanel
          explanation={explanation}
          expandedSection={expandedSection}
          onToggleSection={toggleSection}
          onReadAloud={handleReadExplanationAloud}
          isLoadingSpeech={loading.speech}
        />
      )}
    </div>
  );
};

export default ReadingsTab;
