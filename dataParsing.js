import { readFileSync } from 'node:fs'

const rawCharactersString = readFileSync('./data/characters.js', 'utf8')
console.log(rawCharactersString)

