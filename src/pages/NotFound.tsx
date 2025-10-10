import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <h1 className="text-6xl font-title text-liturgy-burgundy mb-4">404</h1>
        <h2 className="text-2xl font-handwriting text-liturgy-purple mb-6">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8 font-script">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white font-handwriting"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 
