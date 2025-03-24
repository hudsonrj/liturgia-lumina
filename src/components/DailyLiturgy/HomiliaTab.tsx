
import React, { useState } from 'react';
import { useAIServices } from '../../hooks/useAIServices';
import { LiturgicalData } from '../../services/liturgicalService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, VolumeIcon, VolumeX } from 'lucide-react';
import { toast } from '@/lib/toast';

interface HomiliaTabProps {
  liturgicalData: LiturgicalData;
  savedHomilia?: any;
  onSaveHomilia: (homilia: any) => void;
}

const HomiliaTab: React.FC<HomiliaTabProps> = ({ 
  liturgicalData, 
  savedHomilia,
  onSaveHomilia
}) => {
  const { generateDailyHomilia, speakText, loading, error } = useAIServices();
  const [homilia, setHomilia] = useState(savedHomilia || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleGenerateHomilia = async () => {
    // Get the Gospel from the liturgical data
    const gospel = liturgicalData.leituras.evangelho[0];
    if (!gospel) {
      toast.error("Não foi possível encontrar o Evangelho para gerar a homilia.");
      return;
    }
    
    try {
      const result = await generateDailyHomilia(
        gospel.texto,
        gospel.referencia,
        liturgicalData.liturgia
      );
      
      setHomilia(result);
      onSaveHomilia(result);
      toast.success("Homilia gerada com sucesso!");
    } catch (err) {
      toast.error("Não foi possível gerar a homilia. Tente novamente.");
      console.error("Error generating homilia:", err);
    }
  };
  
  const handleReadHomilia = async () => {
    if (!homilia) return;
    
    try {
      setIsSpeaking(true);
      await speakText([
        homilia.title,
        homilia.content,
        homilia.conclusion
      ].join(" "));
      setIsSpeaking(false);
    } catch (err) {
      setIsSpeaking(false);
      toast.error("Não foi possível iniciar a leitura. Verifique se seu navegador suporta esta função.");
      console.error("Error with text-to-speech:", err);
    }
  };
  
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {!homilia ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-lg border border-liturgy-gold/20">
          <h3 className="text-2xl font-serif text-liturgy-burgundy mb-4">Gerar Homilia</h3>
          <p className="text-center text-gray-600 mb-6">
            Clique no botão abaixo para gerar uma homilia baseada no Evangelho de hoje.
          </p>
          <Button
            onClick={handleGenerateHomilia}
            disabled={loading.homilia}
            className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white"
          >
            {loading.homilia ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Homilia"
            )}
          </Button>
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-liturgy-burgundy">{homilia.title}</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleGenerateHomilia}
                disabled={loading.homilia}
                className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
              >
                {loading.homilia ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="sr-only">Regenerar</span>
              </Button>
              
              {isSpeaking ? (
                <Button
                  variant="outline"
                  onClick={stopSpeaking}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
                >
                  <VolumeX className="h-4 w-4" />
                  <span className="sr-only">Parar</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleReadHomilia}
                  disabled={loading.speech}
                  className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
                >
                  <VolumeIcon className="h-4 w-4" />
                  <span className="sr-only">Ouvir</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="prose prose-stone max-w-none">
            <div className="liturgy-text whitespace-pre-line mb-8">
              {homilia.content.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            <h3 className="text-xl font-serif text-liturgy-burgundy mb-4">Conclusão</h3>
            <div className="liturgy-text whitespace-pre-line">
              {homilia.conclusion.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomiliaTab;
