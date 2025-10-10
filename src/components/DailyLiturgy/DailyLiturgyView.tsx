import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LiturgicalData } from '../../services/liturgicalService';
import { formatDateLong } from '../../utils/dateUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadingsTab from './ReadingsTab';
import HomiliaTab from './HomiliaTab';
import SaintsTab from './SaintsTab';
import PrayersTab from './PrayersTab';
import NotesTab from './NotesTab';

interface DailyLiturgyViewProps {
  liturgicalData: LiturgicalData;
  selectedDate: Date;
}

const DailyLiturgyView: React.FC<DailyLiturgyViewProps> = ({
  liturgicalData,
  selectedDate
}) => {
  // Garante que selectedDate é uma data válida
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? selectedDate
    : new Date();

  // State for saved data
  const [savedHomilia, setSavedHomilia] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('readings');
  
  // Memoize the storage key to avoid recreating it on every render
  const storageKey = useMemo(() => `liturgia-homilia-${liturgicalData.data}`, [liturgicalData.data]);
  
  // Get stored homilia data
  useEffect(() => {
    const storedHomilia = localStorage.getItem(storageKey);
    if (storedHomilia) {
      try {
        setSavedHomilia(JSON.parse(storedHomilia));
      } catch (e) {
        console.error('Error parsing stored homilia:', e);
      }
    } else {
      setSavedHomilia(null);
    }
  }, [storageKey]);
  
  // Handle saving homilia with useCallback to prevent unnecessary re-renders
  const handleSaveHomilia = useCallback((homilia: any) => {
    localStorage.setItem(storageKey, JSON.stringify(homilia));
    setSavedHomilia(homilia);
  }, [storageKey]);
  
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-liturgy-gold/20">
        <h2 className="text-2xl font-title text-liturgy-burgundy mb-2">
          {formatDateLong(validSelectedDate)}
        </h2>
        <p className="text-liturgy-purple font-handwriting text-lg">
          {liturgicalData.data}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="readings">Leituras</TabsTrigger>
          <TabsTrigger value="homilia">Homilia</TabsTrigger>
          <TabsTrigger value="saints">Santos</TabsTrigger>
          <TabsTrigger value="prayers">Orações</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
        </TabsList>
        <TabsContent value="readings">
          <ReadingsTab liturgicalData={liturgicalData} />
        </TabsContent>
        <TabsContent value="homilia">
          <HomiliaTab
            liturgicalData={liturgicalData}
            savedHomilia={savedHomilia}
            onSaveHomilia={handleSaveHomilia}
          />
        </TabsContent>
        <TabsContent value="saints">
          <SaintsTab saints={liturgicalData.saints || []} date={validSelectedDate} />
        </TabsContent>
        <TabsContent value="prayers">
          <PrayersTab liturgicalData={liturgicalData} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab selectedDate={validSelectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyLiturgyView;
