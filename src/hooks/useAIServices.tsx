
import { useState } from 'react';
import {
  generateReadingExplanation,
  generateHomilia,
  generateSaintInfo,
  textToSpeech,
  AIExplanationResponse,
  AIHomiliaResponse,
  AISaintResponse
} from '../services/aiService';

export const useAIServices = () => {
  const [readingExplanation, setReadingExplanation] = useState<AIExplanationResponse | null>(null);
  const [homilia, setHomilia] = useState<AIHomiliaResponse | null>(null);
  const [saintInfo, setSaintInfo] = useState<Record<string, AISaintResponse>>({});
  const [loading, setLoading] = useState<{
    explanation: boolean;
    homilia: boolean;
    saintInfo: boolean;
    speech: boolean;
  }>({
    explanation: false,
    homilia: false,
    saintInfo: false,
    speech: false
  });
  const [error, setError] = useState<{
    explanation: Error | null;
    homilia: Error | null;
    saintInfo: Error | null;
    speech: Error | null;
  }>({
    explanation: null,
    homilia: null,
    saintInfo: null,
    speech: null
  });

  const explainReading = async (readingText: string, readingReference: string) => {
    try {
      setLoading(prev => ({ ...prev, explanation: true }));
      setError(prev => ({ ...prev, explanation: null }));
      
      const explanation = await generateReadingExplanation(readingText, readingReference);
      setReadingExplanation(explanation);
      
      return explanation;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(prev => ({ ...prev, explanation: error }));
      console.error('Error generating reading explanation:', err);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, explanation: false }));
    }
  };

  const generateDailyHomilia = async (gospelText: string, gospelReference: string, liturgicalDay: string) => {
    try {
      setLoading(prev => ({ ...prev, homilia: true }));
      setError(prev => ({ ...prev, homilia: null }));
      
      const homiliaResult = await generateHomilia(gospelText, gospelReference, liturgicalDay);
      setHomilia(homiliaResult);
      
      return homiliaResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(prev => ({ ...prev, homilia: error }));
      console.error('Error generating homilia:', err);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, homilia: false }));
    }
  };

  const getSaintInformation = async (saintName: string) => {
    // If we already have this saint's info, return it
    if (saintInfo[saintName]) {
      return saintInfo[saintName];
    }
    
    try {
      setLoading(prev => ({ ...prev, saintInfo: true }));
      setError(prev => ({ ...prev, saintInfo: null }));
      
      const info = await generateSaintInfo(saintName);
      setSaintInfo(prev => ({ ...prev, [saintName]: info }));
      
      return info;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(prev => ({ ...prev, saintInfo: error }));
      console.error('Error generating saint information:', err);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, saintInfo: false }));
    }
  };

  const speakText = async (text: string, voiceName?: string) => {
    try {
      setLoading(prev => ({ ...prev, speech: true }));
      setError(prev => ({ ...prev, speech: null }));
      
      await textToSpeech(text, voiceName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(prev => ({ ...prev, speech: error }));
      console.error('Error using text-to-speech:', err);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, speech: false }));
    }
  };

  return {
    readingExplanation,
    homilia,
    saintInfo,
    loading,
    error,
    explainReading,
    generateDailyHomilia,
    getSaintInformation,
    speakText
  };
};
