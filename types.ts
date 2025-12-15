export enum LearningType {
  SUPERVISED = 'Supervised Learning',
  UNSUPERVISED = 'Unsupervised Learning',
  GENERAL = 'General Concepts'
}

export type TopicId = string;

export interface MathSection {
  title: string;
  content: string; // Markdown supported
  formula?: string; // LaTeX-like string for display
}

export interface VizConfig {
  type: 'linear-regression' | 'logistic-regression' | 'k-means' | 'neural-network' | 'pca' | 'none';
  initialData?: any;
}

export interface Topic {
  id: TopicId;
  title: string;
  type: LearningType;
  description: string;
  content: string; // Detailed breakdown
  math: MathSection[];
  useCases: string[];
  viz: VizConfig;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}