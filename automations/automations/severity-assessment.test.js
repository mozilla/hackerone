const { extractSeverityDefinitions, parseHaiResponse } = require('./severity-assessment');
const fs = require('fs');
const path = require('path');

describe('extractSeverityDefinitions', () => {
  const examplePolicy = fs.readFileSync(
    path.join(__dirname, '..', 'fixtures', 'example-policy.md'),
    'utf-8'
  );

  test('extracts the full severity definitions section from a policy', () => {
    const result = extractSeverityDefinitions(examplePolicy);

    expect(result).not.toBeNull();
    expect(result).toContain('# Severity Definitions and Examples');
    expect(result).toContain('## Critical');
    expect(result).toContain('## High');
    expect(result).toContain('## Moderate');
    expect(result).toContain('## Low');
    expect(result).toContain('Remote Code Execution');
    expect(result).toContain('Account takeover through Oauth misconfiguration');
  });

  test('does not include content from other sections', () => {
    const result = extractSeverityDefinitions(examplePolicy);

    expect(result).not.toContain('# Test Plan');
    expect(result).not.toContain('# Submission Guidelines');
    expect(result).not.toContain('# Program Rules');
  });

  test('returns null when section is not found', () => {
    const policyWithoutSection = '# Some Other Section\n\nContent here';
    const result = extractSeverityDefinitions(policyWithoutSection);

    expect(result).toBeNull();
  });
});

describe('parseHaiResponse', () => {
  test('parses standard format response', () => {
    const response = 'SEVERITY: High\nREASONING: This is a serious vulnerability';
    const result = parseHaiResponse(response);

    expect(result.severity).toBe('high');
    expect(result.reasoning).toBe('This is a serious vulnerability');
  });

  test('parses response with markdown bold formatting', () => {
    const response = '**SEVERITY**: Critical\n**REASONING**: Remote code execution detected';
    const result = parseHaiResponse(response);

    expect(result.severity).toBe('critical');
    expect(result.reasoning).toBe('Remote code execution detected');
  });

  test('handles case-insensitive severity values', () => {
    const response = 'severity: LOW\nreasoning: Minor issue';
    const result = parseHaiResponse(response);

    expect(result.severity).toBe('low');
  });

  test('returns null severity when not found', () => {
    const response = 'This response does not contain severity information';
    const result = parseHaiResponse(response);

    expect(result.severity).toBeNull();
    expect(result.reasoning).toBeNull();
  });

  test('parses response with extra text before severity', () => {
    const response = 'Based on my analysis:\n\nSEVERITY: High\n\nREASONING: XSS vulnerability found';
    const result = parseHaiResponse(response);

    expect(result.severity).toBe('high');
    expect(result.reasoning).toBe('XSS vulnerability found');
  });

  test('handles None severity', () => {
    const response = 'SEVERITY: None\nREASONING: This is not a valid security issue';
    const result = parseHaiResponse(response);

    expect(result.severity).toBe('none');
  });
});
