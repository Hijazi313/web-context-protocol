import { createMcpClient, PrivacyLevel, Context } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';
import { createAnalyzers, AnalyzerFactoryOptions, AnalysisResult } from '../analyzers';

export interface AuditOptions extends AnalyzerFactoryOptions {
  url: string;
  privacyLevel: PrivacyLevel;
  maxDomDepth?: number;
  maxContextSize?: number;
  updateIntervalMs?: number;
}

export interface AuditReport {
  id: string;
  url: string;
  date: string;
  overallScore: number;
  sections: AnalysisResult[];
}

export interface AuditProgress {
  status: 'initializing' | 'capturing' | 'analyzing' | 'generating' | 'complete' | 'error';
  progress: number;
  message?: string;
  error?: Error;
}

export type ProgressCallback = (progress: AuditProgress) => void;

export class AuditService {
  private static instance: AuditService;
  private reports: Map<string, AuditReport> = new Map();

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  public async runAudit(
    options: AuditOptions,
    onProgress?: ProgressCallback
  ): Promise<AuditReport> {
    try {
      // Update progress
      onProgress?.({
        status: 'initializing',
        progress: 0,
        message: 'Initializing audit...',
      });

      // Create a browser context provider
      const provider = createBrowserContextProvider({
        observeDomMutations: true,
        trackUserInteractions: true,
        trackNavigation: true,
        maxDomDepth: options.maxDomDepth || 10,
      });

      // Create an MCP client
      const client = createMcpClient({
        privacyLevel: options.privacyLevel,
        permissions: ['dom.read', 'user.interaction'],
        scope: 'current-view',
        realTimeUpdates: true,
        maxContextSize: options.maxContextSize || 1024 * 1024, // 1MB
        updateIntervalMs: options.updateIntervalMs || 1000,
      });

      // Initialize the client with the provider
      client.initialize(provider);

      // Update progress
      onProgress?.({
        status: 'capturing',
        progress: 20,
        message: 'Capturing website context...',
      });

      // Get context
      const contextResult = await client.getContext({
        includeDOM: true,
        includeUserContext: true,
        maxDepth: options.maxDomDepth || 10,
      });

      if (!contextResult.success) {
        throw new Error(`Failed to capture context: ${contextResult.error}`);
      }

      const context = contextResult.context;

      // Update progress
      onProgress?.({
        status: 'analyzing',
        progress: 40,
        message: 'Analyzing website...',
      });

      // Create analyzers
      const analyzers = createAnalyzers(options);

      // Run analyzers
      const analysisResults: AnalysisResult[] = [];
      let completedAnalyzers = 0;

      for (const analyzer of analyzers) {
        try {
          const result = await analyzer.analyze(context);
          analysisResults.push(result);

          // Update progress
          completedAnalyzers++;
          const analyzeProgress = 40 + (completedAnalyzers / analyzers.length) * 40;
          onProgress?.({
            status: 'analyzing',
            progress: analyzeProgress,
            message: `Analyzing ${analyzer.getCategory()}...`,
          });
        } catch (error) {
          console.error(`Error analyzing ${analyzer.getCategory()}:`, error);
        }
      }

      // Update progress
      onProgress?.({
        status: 'generating',
        progress: 80,
        message: 'Generating report...',
      });

      // Calculate overall score
      const overallScore = this.calculateOverallScore(analysisResults);

      // Generate report ID
      const reportId = this.generateReportId();

      // Create report
      const report: AuditReport = {
        id: reportId,
        url: options.url,
        date: new Date().toISOString(),
        overallScore,
        sections: analysisResults,
      };

      // Store report
      this.reports.set(reportId, report);

      // Update progress
      onProgress?.({
        status: 'complete',
        progress: 100,
        message: 'Audit complete!',
      });

      // Clean up
      client.dispose();

      return report;
    } catch (error) {
      // Update progress with error
      onProgress?.({
        status: 'error',
        progress: 0,
        message: 'Audit failed!',
        error: error as Error,
      });

      throw error;
    }
  }

  public getReport(id: string): AuditReport | undefined {
    return this.reports.get(id);
  }

  public getAllReports(): AuditReport[] {
    return Array.from(this.reports.values());
  }

  private calculateOverallScore(results: AnalysisResult[]): number {
    if (results.length === 0) {
      return 0;
    }

    // Calculate weighted average based on number of issues
    const totalIssues = results.reduce((sum, result) => sum + result.issues.length, 0);

    if (totalIssues === 0) {
      // If no issues, average the scores
      const sum = results.reduce((sum, result) => sum + result.score, 0);
      return Math.round(sum / results.length);
    }

    // Weight categories with more issues more heavily
    let weightedSum = 0;
    let totalWeight = 0;

    for (const result of results) {
      const weight = 1 + result.issues.length / totalIssues;
      weightedSum += result.score * weight;
      totalWeight += weight;
    }

    return Math.round(weightedSum / totalWeight);
  }

  private generateReportId(): string {
    // Generate a simple UUID-like string
    return (
      'report-' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
