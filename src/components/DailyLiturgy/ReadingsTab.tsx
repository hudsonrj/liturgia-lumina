
import React, { useState } from 'react';
import { LiturgicalData, Reading, PsalmReading } from '../../services/liturgicalService';
import { useAIServices } from '../../hooks/useAIServices';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Info, VolumeIcon } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  
  const renderReadingContent = (type: 'first' | 'psalm' | 'second' | 'gospel') => {
    const reading = getActiveReading(type);
    if (!reading) return null;
    
    const isExpanded = expandedReadings[type];
    const paragraphs = reading.texto.split('\n');
    
    return (
      <div className="liturgy-text">
        {isExpanded ? (
          // Mostrar texto completo
          paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4 font-script">{paragraph}</p>
          ))
        ) : (
          // Mostrar apenas os primeiros 2 parágrafos ou menos
          <>
            {paragraphs.slice(0, Math.min(2, paragraphs.length)).map((paragraph, i) => (
              <p key={i} className="mb-4 font-script">{paragraph}</p>
            ))}
            {paragraphs.length > 2 && (
              <div className="text-center mt-2">
                <Button 
                  variant="link" 
                  onClick={() => toggleReadingExpansion(type)}
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
              onClick={() => toggleReadingExpansion(type)}
              className="font-handwriting text-liturgy-burgundy hover:text-liturgy-gold"
            >
              Recolher leitura
            </Button>
          </div>
        )}
      </div>
    );
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
          <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
            <CardHeader>
              <CardTitle className="font-title text-liturgy-burgundy">
                {getActiveReading('first')?.referencia}
              </CardTitle>
              <CardDescription>
                {(getActiveReading('first') as Reading)?.titulo || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderReadingContent('first')}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('first')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('first')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <VolumeIcon className="mr-2 h-4 w-4" />
                Ouvir
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="psalm">
          <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
            <CardHeader>
              <CardTitle className="font-title text-liturgy-burgundy">
                {getActiveReading('psalm')?.referencia}
              </CardTitle>
              <CardDescription className="font-medium text-liturgy-purple italic font-handwriting">
                {(getActiveReading('psalm') as PsalmReading)?.refrao || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderReadingContent('psalm')}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('psalm')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('psalm')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <VolumeIcon className="mr-2 h-4 w-4" />
                Ouvir
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {secondReadings.length > 0 && (
          <TabsContent value="second">
            <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader>
                <CardTitle className="font-title text-liturgy-burgundy">
                  {getActiveReading('second')?.referencia}
                </CardTitle>
                <CardDescription>
                  {(getActiveReading('second') as Reading)?.titulo || ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderReadingContent('second')}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleExplainReading('second')}
                  disabled={loading.explanation}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Explicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReadAloud(getActiveReading('second')?.texto || '')}
                  disabled={loading.speech}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
                >
                  <VolumeIcon className="mr-2 h-4 w-4" />
                  Ouvir
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="gospel">
          <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
            <CardHeader>
              <CardTitle className="font-title text-liturgy-burgundy">
                {getActiveReading('gospel')?.referencia}
              </CardTitle>
              <CardDescription>
                {(getActiveReading('gospel') as Reading)?.titulo || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderReadingContent('gospel')}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('gospel')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('gospel')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
              >
                <VolumeIcon className="mr-2 h-4 w-4" />
                Ouvir
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {explanation && (
        <div className="mt-8 animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-liturgy-gold/20">
          <h3 className="text-xl font-title text-liturgy-burgundy mb-4">Explicação</h3>
          
          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSection('explanation')}
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
                  onClick={() => toggleSection('practical')}
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
                  onClick={() => toggleSection('examples')}
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
              onClick={() => handleReadAloud([
                "Explicação teológica.",
                explanation.data.explanation,
                "Aplicação prática.",
                explanation.data.practicalEffects,
                "Exemplos concretos.",
                ...explanation.data.examples
              ].join(" "))}
              disabled={loading.speech}
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 font-handwriting"
            >
              <VolumeIcon className="mr-2 h-4 w-4" />
              Ouvir Explicação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingsTab;
