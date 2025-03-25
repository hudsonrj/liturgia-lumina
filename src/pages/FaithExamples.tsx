
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar } from 'lucide-react';
import { formatDateLong } from '../utils/dateUtils';
import { useAIServices } from '../hooks/useAIServices';
import { toast } from '@/lib/toast';

interface FaithExample {
  title: string;
  story: string;
  lesson: string;
  jesusConnection: string;
  scripture: string;
  date: string;
}

const FaithExamples = () => {
  const navigate = useNavigate();
  const [currentDate] = useState<Date>(new Date());
  const [faithExample, setFaithExample] = useState<FaithExample | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { speakText } = useAIServices();
  
  useEffect(() => {
    // Inicializar animações quando o componente montar
    const tl = gsap.timeline();
    
    tl.from(".header-anim", {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });
    
    tl.from(".content-anim", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.3");
    
    // Limpar timeline quando o componente desmontar
    return () => {
      tl.kill();
    };
  }, []);
  
  useEffect(() => {
    // Verificar se há um exemplo salvo para o dia atual
    const today = formatDateLong(currentDate);
    const savedExample = localStorage.getItem(`faith-example-${today}`);
    
    if (savedExample) {
      setFaithExample(JSON.parse(savedExample));
      setLoading(false);
    } else {
      generateFaithExample();
    }
  }, [currentDate]);
  
  const generateFaithExample = async () => {
    setLoading(true);
    
    // Exemplos fixos de histórias de fé para demonstração
    // Em um ambiente real, você usaria a API de IA para gerar estas histórias
    const examples = [
      {
        title: "A Cura de Santa Bernadette",
        story: "Bernadette Soubirous nasceu em uma família pobre em Lourdes, França. Durante sua vida, sofreu de asma severa e outras doenças. Em 1858, aos 14 anos, Bernadette teve visões da Virgem Maria em uma gruta próxima. A Virgem pediu que ela cavasse no chão, onde uma fonte de água surgiu. Esta água é conhecida por suas propriedades curativas milagrosas, e milhões de peregrinos visitam Lourdes todos os anos buscando cura.",
        lesson: "A fé de Bernadette nos ensina sobre humildade e perseverança. Mesmo quando muitos duvidavam dela, incluindo autoridades religiosas, ela permaneceu fiel ao que havia testemunhado.",
        jesusConnection: "Assim como Jesus frequentemente curava os doentes e abraçava os marginalizados, a história de Bernadette mostra como Deus trabalha através dos mais simples e como a cura física pode simbolizar uma renovação espiritual mais profunda.",
        scripture: "Mateus 5:8 - 'Bem-aventurados os puros de coração, pois verão a Deus.'",
        date: formatDateLong(currentDate)
      },
      {
        title: "A Conversão de São Paulo",
        story: "Saulo de Tarso era um perseguidor fervoroso dos primeiros cristãos. Durante uma viagem a Damasco, ele foi cegado por uma luz brilhante e ouviu a voz de Jesus perguntando: 'Saulo, Saulo, por que me persegues?' Esta experiência transformou completamente sua vida. Após recuperar a visão três dias depois, Saulo—agora chamado Paulo—tornou-se um dos mais influentes apóstolos de Cristo, escrevendo grande parte do Novo Testamento e expandindo a igreja primitiva.",
        lesson: "A transformação de Paulo nos ensina que ninguém está além da graça de Deus e que mesmo nossos maiores oponentes podem se tornar nossos aliados mais valiosos quando tocados pelo amor divino.",
        jesusConnection: "Jesus ensinou sobre perdão e transformação radical. A história de Paulo demonstra como o encontro com Cristo pode mudar completamente o curso de uma vida, transformando ódio em amor e perseguição em serviço.",
        scripture: "Atos 9:15-16 - 'Mas o Senhor disse: Vai, porque este é para mim um instrumento escolhido para levar o meu nome perante os gentios, e reis, e filhos de Israel; pois eu lhe mostrarei quanto lhe cumpre padecer pelo meu nome.'",
        date: formatDateLong(currentDate)
      },
      {
        title: "Padre Pio e os Estigmas",
        story: "Francesco Forgione, conhecido como Padre Pio, foi um frade capuchinho italiano conhecido por manifestar os estigmas—feridas correspondentes às de Cristo na cruz. Estes apareceram pela primeira vez em 1918 e permaneceram com ele por 50 anos, até sua morte. Médicos examinaram suas feridas sem encontrar explicação natural. Além disso, Padre Pio era conhecido por sua capacidade de ler corações durante confissões e por seus dons de cura e bilocação.",
        lesson: "A vida de Padre Pio nos ensina sobre a união mística com o sofrimento de Cristo e como podemos participar do mistério da redenção através de nossas próprias dores.",
        jesusConnection: "São Paulo escreveu sobre 'completar na minha carne o que falta às aflições de Cristo'. Padre Pio exemplifica esta união profunda com o sofrimento redentor de Jesus, demonstrando como o corpo místico de Cristo continua sua obra salvífica no mundo.",
        scripture: "Gálatas 6:17 - 'Quanto a mim, que ninguém me moleste; porque trago no meu corpo as marcas de Jesus.'",
        date: formatDateLong(currentDate)
      },
      {
        title: "Madre Teresa nas Favelas de Calcutá",
        story: "Agnes Gonxha Bojaxhiu, conhecida como Madre Teresa, deixou sua posição confortável como professora para servir os mais pobres dos pobres nas favelas de Calcutá, Índia. Em 1950, fundou as Missionárias da Caridade, dedicando-se a cuidar dos doentes, órfãos e moribundos que haviam sido abandonados. Apesar de enfrentar sua própria 'noite escura da alma'—décadas de sentimento de ausência de Deus—ela continuou seu trabalho com alegria e amor incansáveis.",
        lesson: "A vida de Madre Teresa nos ensina que o amor genuíno se manifesta em ação concreta, especialmente para aqueles que a sociedade rejeita. Sua perseverança durante a aridez espiritual demonstra que a fé vai além dos sentimentos.",
        jesusConnection: "Jesus ensinou que o que fazemos pelo menor dos seus irmãos, fazemos por Ele. Madre Teresa viu literalmente o rosto de Cristo nos leprosos, nos famintos e nos moribundos, encarnando o mandamento de amar ao próximo como a si mesmo.",
        scripture: "Mateus 25:40 - 'Em verdade vos digo que, quando o fizestes a um destes meus pequeninos irmãos, a mim o fizestes.'",
        date: formatDateLong(currentDate)
      },
      {
        title: "O Milagre do Sol em Fátima",
        story: "Em 13 de outubro de 1917, cerca de 70.000 pessoas reuniram-se em Fátima, Portugal, onde três crianças pastoras—Lúcia, Francisco e Jacinta—haviam relatado aparições da Virgem Maria. Mesmo sob chuva intensa, a multidão testemunhou o que ficou conhecido como 'O Milagre do Sol': o sol pareceu dançar no céu, emitindo várias cores e movendo-se em zigue-zague, antes de parecer cair em direção à Terra. Testemunhas relataram que suas roupas encharcadas secaram instantaneamente. Este evento foi testemunhado por crentes e céticos, incluindo jornalistas seculares.",
        lesson: "O milagre de Fátima nos ensina sobre a intervenção divina na história humana e a importância da oração e penitência, mensagens centrais das aparições.",
        jesusConnection: "As aparições de Fátima enfatizaram a necessidade de conversão e reparação pelos pecados do mundo, ecoando as próprias palavras de Jesus sobre arrependimento e sua promessa de que os puros de coração veriam a Deus.",
        scripture: "Lucas 1:48-49 - 'Porque contemplou na humildade da sua serva. Pois desde agora todas as gerações me chamarão bem-aventurada, porque o Poderoso me fez grandes coisas.'",
        date: formatDateLong(currentDate)
      }
    ];
    
    // Selecionar um exemplo aleatório
    const randomIndex = Math.floor(Math.random() * examples.length);
    const exampleForToday = examples[randomIndex];
    
    // Salvar no localStorage para uso futuro
    localStorage.setItem(`faith-example-${exampleForToday.date}`, JSON.stringify(exampleForToday));
    
    // Atualizar o estado
    setFaithExample(exampleForToday);
    setLoading(false);
  };
  
  const handleBackToHome = () => {
    navigate('/');
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="text-liturgy-burgundy hover:bg-liturgy-gold/10 header-anim"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-title text-liturgy-burgundy header-anim">
            Exemplos de Fé
          </h1>
          
          <div className="flex items-center space-x-2 header-anim">
            <Button
              variant="outline"
              onClick={() => navigate('/daily-readings')}
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
            >
              <Calendar className="h-4 w-4 md:mr-2" />
              <span className="sr-only md:not-sr-only">Leituras do Dia</span>
            </Button>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card className="content-anim bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : faithExample ? (
            <Card className="content-anim bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="font-title text-2xl md:text-3xl text-liturgy-burgundy">
                  {faithExample.title}
                </CardTitle>
                <CardDescription className="font-handwriting text-lg">
                  {faithExample.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-handwriting text-xl text-liturgy-purple mb-2">A História</h3>
                  <p className="font-handwriting text-lg mb-4">{faithExample.story}</p>
                  <div className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReadAloud(faithExample.story)}
                      className="font-handwriting text-liturgy-burgundy hover:bg-liturgy-gold/10"
                    >
                      Ouvir História
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-handwriting text-xl text-liturgy-purple mb-2">Lição de Fé</h3>
                  <p className="font-handwriting text-lg">{faithExample.lesson}</p>
                </div>
                
                <div>
                  <h3 className="font-handwriting text-xl text-liturgy-purple mb-2">Conexão com Jesus</h3>
                  <p className="font-handwriting text-lg">{faithExample.jesusConnection}</p>
                </div>
                
                <div className="bg-liturgy-gold/10 p-4 rounded-lg">
                  <p className="font-script text-lg text-center italic">{faithExample.scripture}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center content-anim">
              <p className="font-handwriting text-lg text-gray-600 mb-4">
                Não foi possível carregar o exemplo de fé para hoje.
              </p>
              <Button 
                onClick={generateFaithExample}
                className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white font-handwriting"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaithExamples;
