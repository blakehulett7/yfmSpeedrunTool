import { readFileSync } from 'node:fs'

const rawCharactersString = readFileSync('./data/characters.js', 'utf8')
const rawCharacterList = rawCharactersString.split('\n')
const trimmedCharacterList = rawCharacterList.slice(1, -3)
console.log(trimmedCharacterList)
