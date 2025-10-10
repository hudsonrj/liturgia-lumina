export type AnalysisType = 'OR' | 'HI' | 'EX' | 'JS' | 'BL' | 'AU' | 'PG';

export interface BibleVerse {
  id?: string;
  book: string;
  chapter: number;
  number: number;
  verse: number;
  text: string;
  analysisType?: AnalysisType;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'old' | 'new';
} 