import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prayer } from '@/services/liturgicalService';

interface PrayersTabProps {
  liturgicalData: {
    oracoes: {
      coleta: string;
      oferendas: string;
      comunhao: string;
      extras: Prayer[];
    };
  };
}

const GradientBackground = () => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
    }, 1000 / 60);

    return () => clearInterval(moveInterval);
  }, [curX, curY, tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,rgb(108,0,162),rgb(0,17,82))]">
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className={`gradients-container h-full w-full blur-lg ${
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        }`}
      >
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(18,113,255,0.8)_0,_rgba(18,113,255,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] [transform-origin:center_center] animate-first opacity-100" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(221,74,255,0.8)_0,_rgba(221,74,255,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] [transform-origin:calc(50%-400px)] animate-second opacity-100" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(100,220,255,0.8)_0,_rgba(100,220,255,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] [transform-origin:calc(50%+400px)] animate-third opacity-100" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(200,50,50,0.8)_0,_rgba(200,50,50,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] [transform-origin:calc(50%-200px)] animate-fourth opacity-70" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(180,180,50,0.8)_0,_rgba(180,180,50,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] [transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth opacity-100" />

        <div
          ref={interactiveRef}
          onMouseMove={handleMouseMove}
          className="absolute [background:radial-gradient(circle_at_center,_rgba(140,100,255,0.8)_0,_rgba(140,100,255,0)_50%)_no-repeat] [mix-blend-mode:hard-light] w-full h-full -top-1/2 -left-1/2 opacity-70"
        />
      </div>
    </div>
  );
};

const PrayersTab: React.FC<PrayersTabProps> = ({ liturgicalData }) => {
  const [completedPrayers, setCompletedPrayers] = useState<string[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<{ title: string; text: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const prayers = [
    // Orações do Dia
    { id: 'coleta', title: 'Oração da Coleta', text: liturgicalData.oracoes.coleta },
    { id: 'oferendas', title: 'Oração das Oferendas', text: liturgicalData.oracoes.oferendas },
    { id: 'comunhao', title: 'Oração da Comunhão', text: liturgicalData.oracoes.comunhao },
    ...liturgicalData.oracoes.extras.map((prayer, index) => ({
      id: `extra-${index}`,
      title: prayer.titulo || 'Oração Extra',
      text: prayer.texto
    })),
    // Orações Principais
    {
      id: 'pai-nosso',
      title: 'Pai Nosso',
      text: `Pai nosso que estais nos céus,
santificado seja o vosso nome;
venha a nós o vosso reino;
seja feita a vossa vontade,
assim na terra como no céu.
O pão nosso de cada dia nos dai hoje;
perdoai-nos as nossas ofensas,
assim como nós perdoamos a quem nos tem ofendido;
e não nos deixeis cair em tentação,
mas livrai-nos do mal.
Amém.`
    },
    {
      id: 'ave-maria',
      title: 'Ave Maria',
      text: `Ave Maria, cheia de graça,
o Senhor é convosco,
bendita sois vós entre as mulheres,
e bendito é o fruto do vosso ventre, Jesus.
Santa Maria, Mãe de Deus,
rogai por nós, pecadores,
agora e na hora da nossa morte.
Amém.`
    },
    {
      id: 'credo',
      title: 'Credo',
      text: `Creio em um só Deus, Pai todo-poderoso,
Criador do céu e da terra,
de todas as coisas visíveis e invisíveis.
Creio em um só Senhor, Jesus Cristo,
Filho Unigênito de Deus,
nascido do Pai antes de todos os séculos:
Deus de Deus, Luz da Luz,
Deus verdadeiro de Deus verdadeiro,
gerado, não criado, consubstancial ao Pai.
Por Ele todas as coisas foram feitas.
E por nós, homens, e para nossa salvação,
desceu dos céus:
e encarnou pelo Espírito Santo,
no seio da Virgem Maria,
e se fez homem.
Também por nós foi crucificado sob Pôncio Pilatos;
padeceu e foi sepultado.
Ressuscitou ao terceiro dia,
conforme as Escrituras;
e subiu aos céus, onde está sentado à direita do Pai.
De novo há de vir, em glória,
para julgar os vivos e os mortos;
e o seu reino não terá fim.
Creio no Espírito Santo,
Senhor que dá a vida,
e procede do Pai e do Filho;
e com o Pai e o Filho é adorado e glorificado:
Ele que falou pelos profetas.
Creio na Igreja, una, santa, católica e apostólica.
Professo um só batismo para a remissão dos pecados.
E espero a ressurreição dos mortos;
e a vida do mundo que há de vir.
Amém.`
    },
    {
      id: 'gloria',
      title: 'Glória ao Pai',
      text: `Glória ao Pai, ao Filho e ao Espírito Santo,
como era no princípio, agora e sempre.
Amém.`
    },
    {
      id: 'salve-rainha',
      title: 'Salve Rainha',
      text: `Salve, Rainha, Mãe de misericórdia,
vida, doçura e esperança nossa, salve!
A vós bradamos, os degredados filhos de Eva;
a vós suspiramos, gemendo e chorando neste vale de lágrimas.
Eia, pois, advogada nossa,
esses vossos olhos misericordiosos a nós volvei,
e depois deste desterro nos mostrai Jesus,
bendito fruto do vosso ventre.
Ó clemente, ó piedosa, ó doce sempre Virgem Maria!
Rogai por nós, Santa Mãe de Deus,
para que sejamos dignos das promessas de Cristo.
Amém.`
    },
    {
      id: 'anjus-deus',
      title: 'Ânjo de Deus',
      text: `Ânjo de Deus, que sois meu guarda,
a quem o amor de Deus me confiou,
iluminai-me, guardai-me, regei-me e governai-me.
Amém.`
    }
  ];

  const handlePrayerClick = (prayer: { title: string; text: string }) => {
    setSelectedPrayer(prayer);
    setIsDialogOpen(true);
  };

  const handlePrayerComplete = (prayerId: string) => {
    setCompletedPrayers(prev => {
      if (prev.includes(prayerId)) {
        return prev.filter(id => id !== prayerId);
      }
      return [...prev, prayerId];
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-liturgy-gold/20">
        <h3 className="text-xl font-title text-liturgy-burgundy mb-4">
          Orações do Dia
        </h3>
        
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg border border-liturgy-gold/20 hover:bg-liturgy-gold/5 transition-colors"
            >
              <Checkbox
                id={prayer.id}
                checked={completedPrayers.includes(prayer.id)}
                onCheckedChange={() => handlePrayerComplete(prayer.id)}
                className="border-liturgy-gold data-[state=checked]:bg-liturgy-burgundy data-[state=checked]:border-liturgy-burgundy"
              />
              <Button
                variant="ghost"
                className="flex-1 justify-start text-left font-handwriting text-lg text-liturgy-purple hover:text-liturgy-burgundy"
                onClick={() => handlePrayerClick(prayer)}
              >
                {prayer.title}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl h-[80vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">{selectedPrayer?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Texto da oração {selectedPrayer?.title}
          </DialogDescription>
          <div className="relative h-full">
            <GradientBackground />
            <div className="absolute inset-0 z-10 p-6">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  <h2 className="text-3xl font-title text-white text-center mb-6">
                    {selectedPrayer?.title}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-lg leading-relaxed font-script whitespace-pre-line">
                      {selectedPrayer?.text}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayersTab; 