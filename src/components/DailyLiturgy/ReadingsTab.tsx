
import React, { useState } from 'react';
import { LiturgicalData } from '../../services/liturgicalService';
import { useAIServices } from '../../hooks/useAIServices';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Info, VolumeIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ReadingsTabProps {
  liturgicalData: LiturgicalData;
}

const ReadingsTab: React.FC<ReadingsTabProps> = ({ liturgicalData }) => {
  const { explainReading, speakText, loading, error } = useAIServices();
  const [activeReadingIndex, setActiveReadingIndex] = useState(0);
  const [explanation, setExplanation] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
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
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="first" className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 bg-liturgy-parchment">
          <TabsTrigger value="first" className="font-serif">1ª Leitura</TabsTrigger>
          <TabsTrigger value="psalm" className="font-serif">Salmo</TabsTrigger>
          {secondReadings.length > 0 && (
            <TabsTrigger value="second" className="font-serif">2ª Leitura</TabsTrigger>
          )}
          <TabsTrigger value="gospel" className="font-serif">Evangelho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="first">
          <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
            <CardHeader>
              <CardTitle className="font-serif text-liturgy-burgundy">
                {getActiveReading('first')?.referencia}
              </CardTitle>
              <CardDescription>
                {getActiveReading('first')?.titulo}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="liturgy-text whitespace-pre-line">
                {getActiveReading('first')?.texto.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('first')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('first')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
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
              <CardTitle className="font-serif text-liturgy-burgundy">
                {getActiveReading('psalm')?.referencia}
              </CardTitle>
              <CardDescription className="font-medium text-liturgy-purple italic">
                "{getActiveReading('psalm')?.refrao}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="liturgy-text whitespace-pre-line">
                {getActiveReading('psalm')?.texto.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('psalm')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('psalm')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
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
                <CardTitle className="font-serif text-liturgy-burgundy">
                  {getActiveReading('second')?.referencia}
                </CardTitle>
                <CardDescription>
                  {getActiveReading('second')?.titulo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="liturgy-text whitespace-pre-line">
                  {getActiveReading('second')?.texto.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleExplainReading('second')}
                  disabled={loading.explanation}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Explicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReadAloud(getActiveReading('second')?.texto || '')}
                  disabled={loading.speech}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
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
              <CardTitle className="font-serif text-liturgy-burgundy">
                {getActiveReading('gospel')?.referencia}
              </CardTitle>
              <CardDescription>
                {getActiveReading('gospel')?.titulo}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="liturgy-text whitespace-pre-line">
                {getActiveReading('gospel')?.texto.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleExplainReading('gospel')}
                disabled={loading.explanation}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
              >
                <Info className="mr-2 h-4 w-4" />
                Explicar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReadAloud(getActiveReading('gospel')?.texto || '')}
                disabled={loading.speech}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
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
          <h3 className="text-xl font-serif text-liturgy-burgundy mb-4">Explicação</h3>
          
          <div className="space-y-4">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => toggleSection('explanation')}
                className="w-full justify-between text-left font-serif text-liturgy-purple"
              >
                <span>Significado Teológico</span>
                <span>{expandedSection === 'explanation' ? '−' : '+'}</span>
              </Button>
              
              {expandedSection === 'explanation' && (
                <div className="p-4 liturgy-text">
                  {explanation.data.explanation}
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Button 
                variant="ghost" 
                onClick={() => toggleSection('practical')}
                className="w-full justify-between text-left font-serif text-liturgy-purple"
              >
                <span>Aplicação Prática</span>
                <span>{expandedSection === 'practical' ? '−' : '+'}</span>
              </Button>
              
              {expandedSection === 'practical' && (
                <div className="p-4 liturgy-text">
                  {explanation.data.practicalEffects}
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Button 
                variant="ghost" 
                onClick={() => toggleSection('examples')}
                className="w-full justify-between text-left font-serif text-liturgy-purple"
              >
                <span>Exemplos Concretos</span>
                <span>{expandedSection === 'examples' ? '−' : '+'}</span>
              </Button>
              
              {expandedSection === 'examples' && (
                <div className="p-4 liturgy-text">
                  <ul className="list-disc pl-5 space-y-2">
                    {explanation.data.examples.map((example: string, i: number) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
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
