import React, { useState, useEffect } from 'react';
import { useAIServices } from '../../hooks/useAIServices';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, RefreshCw, VolumeIcon } from 'lucide-react';
import { toast } from '@/lib/toast';

interface SaintsTabProps {
  saints: string[];
  date: Date;
}

const SaintsTab: React.FC<SaintsTabProps> = ({ saints, date }) => {
  const { getSaintInformation, speakText, loading, error, saintInfo } = useAIServices();
  const [activeSaint, setActiveSaint] = useState<string | null>(null);
  const [loadingSaints, setLoadingSaints] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (saints.length > 0) {
      setActiveSaint(saints[0]);
    } else {
      setActiveSaint(null);
    }
  }, [saints]);
  
  const handleGetSaintInfo = async (saintName: string) => {
    if (saintInfo[saintName]) return;
    
    try {
      setLoadingSaints(prev => ({ ...prev, [saintName]: true }));
      await getSaintInformation(saintName);
      toast.success(`Informações sobre ${saintName} carregadas com sucesso!`);
    } catch (err) {
      toast.error(`Não foi possível carregar informações sobre ${saintName}. Tente novamente.`);
      console.error(`Error getting information for ${saintName}:`, err);
    } finally {
      setLoadingSaints(prev => ({ ...prev, [saintName]: false }));
    }
  };
  
  const handleSpeakSaintInfo = async (saintName: string) => {
    if (!saintInfo[saintName]) return;
    
    try {
      const info = saintInfo[saintName];
      await speakText([
        `Biografia de ${saintName}.`,
        info.biography,
        "Ensinamentos.",
        info.teachings,
        "Relevância para hoje.",
        info.relevanceToday
      ].join(" "));
    } catch (err) {
      toast.error("Não foi possível iniciar a leitura. Verifique se seu navegador suporta esta função.");
      console.error("Error with text-to-speech:", err);
    }
  };
  
  return (
    <div className="space-y-6">
      {saints.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-liturgy-burgundy">
              Santos do Dia
            </CardTitle>
            <CardDescription>
              Não há santos listados para esta data.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
            <CardHeader>
              <CardTitle className="font-serif text-liturgy-burgundy">
                Santos do Dia
              </CardTitle>
              <CardDescription>
                Conheça os santos celebrados nesta data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeSaint || saints[0]} 
                onValueChange={setActiveSaint} 
                className="w-full"
              >
                <TabsList className="mb-6 grid grid-cols-2 bg-liturgy-parchment">
                  {saints.map(saint => (
                    <TabsTrigger 
                      key={saint} 
                      value={saint}
                      className="font-serif"
                      onClick={() => !saintInfo[saint] && handleGetSaintInfo(saint)}
                    >
                      {saint}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {saints.map(saint => (
                  <TabsContent key={saint} value={saint}>
                    {!saintInfo[saint] ? (
                      <div className="flex flex-col items-center justify-center p-8">
                        <p className="text-center text-gray-600 mb-6">
                          Clique no botão abaixo para obter informações sobre {saint}.
                        </p>
                        <Button
                          onClick={() => handleGetSaintInfo(saint)}
                          disabled={loadingSaints[saint]}
                          className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white"
                        >
                          {loadingSaints[saint] ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Carregando...
                            </>
                          ) : (
                            <>
                              <Info className="mr-2 h-4 w-4" />
                              Carregar Informações
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-serif text-liturgy-burgundy mb-2">Biografia</h3>
                          <p className="text-gray-700">{saintInfo[saint].biography}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-serif text-liturgy-burgundy mb-2">Ensinamentos</h3>
                          <p className="text-gray-700">{saintInfo[saint].teachings}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-serif text-liturgy-burgundy mb-2">Relevância Hoje</h3>
                          <p className="text-gray-700">{saintInfo[saint].relevanceToday}</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() => handleSpeakSaintInfo(saint)}
                            disabled={loading.speech}
                            className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
                          >
                            <VolumeIcon className="mr-2 h-4 w-4" />
                            Ouvir
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SaintsTab;
