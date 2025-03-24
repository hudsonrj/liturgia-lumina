
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { formatDateToBrazilian } from '../../utils/dateUtils';

interface NotesTabProps {
  selectedDate: Date;
}

const NotesTab: React.FC<NotesTabProps> = ({ selectedDate }) => {
  const [notes, setNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // Generate a unique storage key for each date
  const getStorageKey = () => `liturgia-notes-${formatDateToBrazilian(selectedDate)}`;
  
  // Load saved notes when the selected date changes
  useEffect(() => {
    const savedNotesFromStorage = localStorage.getItem(getStorageKey());
    if (savedNotesFromStorage) {
      setNotes(savedNotesFromStorage);
      setSavedNotes(savedNotesFromStorage);
      setHasUnsavedChanges(false);
    } else {
      setNotes('');
      setSavedNotes('');
      setHasUnsavedChanges(false);
    }
  }, [selectedDate]);
  
  // Check for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(notes !== savedNotes);
  }, [notes, savedNotes]);
  
  const handleSaveNotes = () => {
    localStorage.setItem(getStorageKey(), notes);
    setSavedNotes(notes);
    setHasUnsavedChanges(false);
    toast.success("Anotações salvas com sucesso!");
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
        <CardHeader>
          <CardTitle className="font-serif text-liturgy-burgundy">
            Suas Anotações
          </CardTitle>
          <CardDescription>
            Registre suas reflexões e pensamentos sobre as leituras de hoje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Escreva suas reflexões aqui..."
            className="min-h-[300px] focus:border-liturgy-gold/50 focus:ring-liturgy-gold/20"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSaveNotes}
            disabled={!hasUnsavedChanges}
            className={`${
              hasUnsavedChanges
                ? 'bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Anotações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotesTab;
