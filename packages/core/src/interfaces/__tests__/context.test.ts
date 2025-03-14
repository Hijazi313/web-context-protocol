import * as contextInterfaces from '../context';

describe('Context Interfaces', () => {
  test('should export PrivacyLevel type', () => {
    expect(typeof contextInterfaces.PrivacyLevel).toBe('object');
  });

  test('should have correct privacy levels', () => {
    const privacyLevels = Object.values(contextInterfaces.PrivacyLevel);
    expect(privacyLevels).toContain('strict');
    expect(privacyLevels).toContain('balanced');
    expect(privacyLevels).toContain('permissive');
    expect(privacyLevels.length).toBe(3);
  });

  test('should export all required interfaces', () => {
    // Check that all expected interfaces are exported
    const exportedInterfaces = [
      'ContextMetadata',
      'DOMNode',
      'Selection',
      'Viewport',
      'Interaction',
      'NavigationHistoryEvent',
      'SessionInfo',
      'Component',
      'DOMContext',
      'UserContext',
      'AppContext',
      'Context',
      'ContextOptions',
      'ContextQuery',
      'QueryResult',
    ];

    exportedInterfaces.forEach(interfaceName => {
      expect(contextInterfaces).toHaveProperty(interfaceName);
    });
  });

  test('Context interface should include all context types', () => {
    // Create a mock Context object to test the interface structure
    const mockContext: contextInterfaces.Context = {
      meta: {
        timestamp: Date.now(),
        source: 'test',
        version: '1.0.0',
        privacyLevel: 'balanced',
        url: 'https://example.com',
        domain: 'example.com',
      },
      dom: {
        title: 'Test Page',
        url: 'https://example.com',
        structure: {
          nodeType: 1,
          nodeName: 'HTML',
          attributes: {},
          children: [],
        },
        selection: {
          text: 'Selected text',
          startNodePath: 'path/to/start',
          endNodePath: 'path/to/end',
          startOffset: 0,
          endOffset: 12,
        },
        viewport: {
          width: 1920,
          height: 1080,
          scrollX: 0,
          scrollY: 0,
          devicePixelRatio: 1,
        },
      },
      user: {
        interactions: [],
        navigation: [],
        session: {
          id: 'test-session',
          startTime: Date.now(),
          duration: 0,
          pageViews: 1,
        },
        preferences: {},
      },
      app: {
        state: {},
        components: [],
        framework: 'react',
        frameworkVersion: '18.0.0',
        route: {
          path: '/test',
          params: {},
          query: {},
        },
      },
    };

    // Verify the structure
    expect(mockContext).toHaveProperty('meta');
    expect(mockContext).toHaveProperty('dom');
    expect(mockContext).toHaveProperty('user');
    expect(mockContext).toHaveProperty('app');
  });

  test('ContextQuery interface should include query options', () => {
    // Create a mock ContextQuery object to test the interface structure
    const mockQuery: contextInterfaces.ContextQuery = {
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: false,
      selector: '#main-content',
      maxDepth: 3,
      privacyLevel: 'strict',
    };

    // Verify the structure
    expect(mockQuery).toHaveProperty('includeDOM');
    expect(mockQuery).toHaveProperty('includeUserContext');
    expect(mockQuery).toHaveProperty('includeAppContext');
    expect(mockQuery).toHaveProperty('selector');
    expect(mockQuery).toHaveProperty('maxDepth');
    expect(mockQuery).toHaveProperty('privacyLevel');
  });
});
