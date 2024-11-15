import { applyReplacements } from '../src/replacementHelper';

describe('applyReplacements', () => {
    it('should replace single occurrence of a pattern', () => {
        const text = 'Hello world';
        const replacements = { 'world': 'there' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello there');
    });

    it('should replace multiple occurrences of a pattern', () => {
        const text = 'Hello world, world!';
        const replacements = { 'world': 'there' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello there, there!');
    });

    it('should replace multiple different patterns', () => {
        const text = 'Hello world, welcome to the universe.';
        const replacements = { 'world': 'there', 'universe': 'multiverse' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello there, welcome to the multiverse.');
    });

    it('should handle empty text', () => {
        const text = '';
        const replacements = { 'world': 'there' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('');
    });

    it('should handle empty replacements', () => {
        const text = 'Hello world';
        const replacements = {};
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello world');
    });

    it('should handle special characters in patterns', () => {
        const text = 'Hello $world$';
        const replacements = { '\\$world\\$': 'there' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello there');
    });

    it('should handle regex special characters in patterns', () => {
        const text = "Hello world! pg122";
        const replacements = { ' (pg\d+)': '#books/atomic-habits/$1' };
        const result = applyReplacements(text, replacements);
        expect(result).toBe('Hello world! #books/atomic-habits/pg122');
    });
});