import { formatDate } from './date-utils';

describe('formatDate', () => {
  it('should format date with default locale and options', () => {
    const result = formatDate('2025-10-31');

    expect(result).toBe('October 31, 2025');
  });

  it('should format date with custom locale', () => {
    const result = formatDate('2025-10-31', 'he-IL');

    expect(result).toContain('2025');
  });

  it('should format date with custom options', () => {
    const result = formatDate('2025-10-31', 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    expect(result).toBe('Oct 31, 2025');
  });

  it('should format date with numeric month', () => {
    const result = formatDate('2025-10-31', 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    expect(result).toBe('10/31/2025');
  });
});