import { readFileSync } from 'node:fs'

const rawCharactersString = readFileSync('../data/characters.js', 'utf8')
const rawCharacterList = rawCharactersString.split('\n')
const trimmedCharacterList = rawCharacterList.slice(1, -3)
const regex = /(?<=link=)(.*)/g
const characterList = []
for (let character of trimmedCharacterList) {
  characterList.push(character.match(regex)[0])
}
console.log(characterList)
