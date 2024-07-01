import { readFileSync } from 'node:fs'
import { test, expect } from '@jest/globals';
import { parseWikitext, getCharacters } from '../src/dataParsing.js';

test('Wikitext Parser', () => {
  const rawJSON = '{"parse":{"title":"Portal:Yu-Gi-Oh! Forbidden Memories characters","pageid":369496,"wikitext":{"*":"sample wikitext"}}}'
  const result = 'sample wikitext'
  expect(parseWikitext(rawJSON)).toBe(result)
})

test('Get Characters', () => {
  const result = [
  'Prince (FMR)',           'Simon Muran (FMR)',
  'Teana',                  'Jono',
  'Card shop owner (FMR)',  'Villager1',
  'Villager2',              'Villager3',
  'Seto (FMR)',             'Heishin',
  'Servant',                'Kemo (FMR)',
  'Yugi (FMR)',             'Joey (FMR)',
  'Tea Gardner (FMR)',      'Rex Raptor (FMR)',
  'Weevil Underwood (FMR)', 'Mai Valentine (FMR)',
  'Bandit Keith (FMR)',     'Shadi (FMR)',
  'Bakura (FMR)',           'Yami Bakura (FMR)',
  'Pegasus (FMR)',          'Isis (FMR)',
  'Kaiba (FMR)',            'Mage Soldier',
  'Sadin',                  'Ocean Mage',
  'High Mage Secmeton',     'Forest Mage',
  'High Mage Anubisius',    'Mountain Mage',
  'High Mage Atenza',       'Desert Mage',
  'High Mage Martis',       'Meadow Mage',
  'High Mage Kepura',       'Labyrinth Mage',
  'Sebek',                  'Neku',
  'Nitemare',               'Duel Master K'
]
  expect(getCharacters()).toStrictEqual(result)
})
