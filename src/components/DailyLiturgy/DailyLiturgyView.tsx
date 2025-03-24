
import React, { useState, useEffect } from 'react';
import { LiturgicalData, getLiturgyColorClass } from '../../services/liturgicalService';
import { formatDateLong } from '../../utils/dateUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadingsTab from './ReadingsTab';
import HomiliaTab from './HomiliaTab';
import NotesTab from './NotesTab';
import SaintsTab from './SaintsTab';

interface DailyLiturgyViewProps {
  liturgicalData: LiturgicalData;
  selectedDate: Date;
}

const DailyLiturgyView: React.FC<DailyLiturgyViewProps> = ({
  liturgicalData,
  selectedDate
}) => {
  // State for saved data
  const [savedHomilia, setSavedHomilia] = useState<any>(null);
  
  // Get stored homilia data
  useEffect(() => {
    const storedHomilia = localStorage.getItem(`liturgia-homilia-${liturgicalData.data}`);
    if (storedHomilia) {
      try {
        setSavedHomilia(JSON.parse(storedHomilia));
      } catch (e) {
        console.error('Error parsing stored homilia:', e);
      }
    } else {
      setSavedHomilia(null);
    }
  }, [liturgicalData.data]);
  
  // Handle saving homilia
  const handleSaveHomilia = (homilia: any) => {
    localStorage.setItem(`liturgia-homilia-${liturgicalData.data}`, JSON.stringify(homilia));
    setSavedHomilia(homilia);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header section */}
      <div className="mb-8 text-center">
        <div className="mb-2">
          <span 
            className={`inline-block px-3 py-1 rounded-full text-base md:text-lg ${getLiturgyColorClass(liturgicalData.cor)}`}
          >
            {liturgicalData.cor}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-title text-liturgy-burgundy mb-2">
          {liturgicalData.liturgia}
        </h1>
        <p className="text-gray-600 font-handwriting text-xl md:text-2xl">
          {formatDateLong(selectedDate)}
        </p>
      </div>
      
      {/* Main content tabs */}
      <Tabs defaultValue="readings" className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-4 bg-liturgy-parchment">
          <TabsTrigger value="readings" className="font-handwriting text-lg md:text-xl">Leituras</TabsTrigger>
          <TabsTrigger value="homilia" className="font-handwriting text-lg md:text-xl">Homilia</TabsTrigger>
          <TabsTrigger value="notes" className="font-handwriting text-lg md:text-xl">Anotações</TabsTrigger>
          <TabsTrigger value="saints" className="font-handwriting text-lg md:text-xl">Santos</TabsTrigger>
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
        
        <TabsContent value="notes">
          <NotesTab selectedDate={selectedDate} />
        </TabsContent>
        
        <TabsContent value="saints">
          <SaintsTab saints={liturgicalData.saints || []} date={selectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyLiturgyView;
