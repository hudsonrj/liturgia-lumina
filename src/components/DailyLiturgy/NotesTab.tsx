import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface NotesTabProps {
  selectedDate: Date;
}

const NotesTab: React.FC<NotesTabProps> = ({ selectedDate }) => {
  const [textNotes, setTextNotes] = useState('');

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-liturgy-gold/20">
        <h3 className="text-xl font-title text-liturgy-burgundy mb-4">
          Anotações do Dia
        </h3>
        <Textarea
          value={textNotes}
          onChange={(e) => setTextNotes(e.target.value)}
          placeholder="Digite suas anotações aqui..."
          className="min-h-[300px] font-script text-lg"
        />
        <Button
          onClick={() => {
            const dateKey = selectedDate.toISOString().split('T')[0];
            localStorage.setItem(`notes_text_${dateKey}`, textNotes);
          }}
          className="mt-4 bg-liturgy-burgundy hover:bg-liturgy-burgundy/90"
        >
          Salvar Anotações
        </Button>
      </div>
    </div>
  );
};

export default NotesTab; 