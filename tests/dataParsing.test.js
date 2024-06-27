import { readFileSync } from 'node:fs'
import { test, expect } from '@jest/globals';
import { parseWikitext, getCharacters } from '../src/dataParsing.js';

test('Wikitext Parser', () => {
  const rawJSON = '{"parse":{"title":"Portal:Yu-Gi-Oh! Forbidden Memories characters","pageid":369496,"wikitext":{"*":"sample wikitext"}}}'
  const result = 'sample wikitext'
  expect(parseWikitext(rawJSON)).toBe(result)
})
