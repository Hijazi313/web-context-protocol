import { Analyzer, AnalyzerOptions } from './types';
import { AccessibilityAnalyzer } from './AccessibilityAnalyzer';

// Import other analyzers as they are implemented
// import { PerformanceAnalyzer } from './PerformanceAnalyzer';
// import { SeoAnalyzer } from './SeoAnalyzer';
// import { SecurityAnalyzer } from './SecurityAnalyzer';
// import { PrivacyAnalyzer } from './PrivacyAnalyzer';
// import { ResponsiveAnalyzer } from './ResponsiveAnalyzer';
// import { ContentAnalyzer } from './ContentAnalyzer';

export interface AnalyzerFactoryOptions {
  accessibility?: boolean;
  performance?: boolean;
  seo?: boolean;
  security?: boolean;
  privacy?: boolean;
  responsive?: boolean;
  content?: boolean;
  analyzerOptions?: AnalyzerOptions;
}

export function createAnalyzers(options: AnalyzerFactoryOptions = {}): Analyzer[] {
  const analyzers: Analyzer[] = [];
  const analyzerOptions = options.analyzerOptions || {};

  if (options.accessibility !== false) {
    analyzers.push(new AccessibilityAnalyzer(analyzerOptions));
  }

  // Add other analyzers as they are implemented
  // if (options.performance !== false) {
  //   analyzers.push(new PerformanceAnalyzer(analyzerOptions));
  // }

  // if (options.seo !== false) {
  //   analyzers.push(new SeoAnalyzer(analyzerOptions));
  // }

  // if (options.security !== false) {
  //   analyzers.push(new SecurityAnalyzer(analyzerOptions));
  // }

  // if (options.privacy !== false) {
  //   analyzers.push(new PrivacyAnalyzer(analyzerOptions));
  // }

  // if (options.responsive !== false) {
  //   analyzers.push(new ResponsiveAnalyzer(analyzerOptions));
  // }

  // if (options.content !== false) {
  //   analyzers.push(new ContentAnalyzer(analyzerOptions));
  // }

  return analyzers;
}

export * from './types';
export * from './AccessibilityAnalyzer';
