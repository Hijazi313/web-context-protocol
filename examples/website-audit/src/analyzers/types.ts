import { Context } from '@mcp/core';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  recommendation: string;
}

export interface AnalysisResult {
  category: string;
  score: number;
  issues: Issue[];
  metadata?: Record<string, any>;
}

export interface Analyzer {
  analyze(context: Context): Promise<AnalysisResult>;
  getCategory(): string;
  getDescription(): string;
}

export interface AnalyzerOptions {
  maxIssues?: number;
  includeMetadata?: boolean;
}

export abstract class BaseAnalyzer implements Analyzer {
  protected options: AnalyzerOptions;

  constructor(options: AnalyzerOptions = {}) {
    this.options = {
      maxIssues: 50,
      includeMetadata: true,
      ...options,
    };
  }

  abstract analyze(context: Context): Promise<AnalysisResult>;
  abstract getCategory(): string;
  abstract getDescription(): string;

  protected limitIssues(issues: Issue[]): Issue[] {
    if (this.options.maxIssues && issues.length > this.options.maxIssues) {
      return issues.slice(0, this.options.maxIssues);
    }
    return issues;
  }

  protected calculateScore(issues: Issue[]): number {
    if (issues.length === 0) {
      return 100;
    }

    // Calculate score based on number and severity of issues
    const severityWeights = {
      high: 10,
      medium: 5,
      low: 2,
    };

    const totalWeight = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
    const maxPossibleWeight = 100; // Arbitrary maximum

    const score = Math.max(0, 100 - (totalWeight / maxPossibleWeight) * 100);

    return Math.round(score);
  }
}
