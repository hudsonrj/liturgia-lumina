
import React, { useState } from 'react';
import { LiturgicalData } from '../../services/liturgicalService';
import { useAIServices } from '../../hooks/useAIServices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <Tabs defaultValue="first" className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 bg-liturgy-parchment">
          <TabsTrigger value="first" className="font-handwriting text-lg md:text-xl">1ª Leitura</TabsTrigger>
          <TabsTrigger value="psalm" className="font-handwriting text-lg md:text-xl">Salmo</TabsTrigger>
          {secondReadings.length > 0 && (
            <TabsTrigger value="second" className="font-handwriting text-lg md:text-xl">2ª Leitura</TabsTrigger>
          )}
          <TabsTrigger value="gospel" className="font-handwriting text-lg md:text-xl">Evangelho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="first">
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
        </TabsContent>
        
        <TabsContent value="psalm">
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
        </TabsContent>
        
        {secondReadings.length > 0 && (
          <TabsContent value="second">
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
          </TabsContent>
        )}
        
        <TabsContent value="gospel">
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
        </TabsContent>
      </Tabs>
      
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
