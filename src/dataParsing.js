import { readFileSync } from 'node:fs'

function parseWikitext(rawJsonString) {
  return rawJsonString.parse.wikitext['*']
}

function getCharacters() {
  const rawCharacters = readFileSync('./data/characters.json', 'utf8')
  const rawCharactersJSON = JSON.parse(rawCharacters)
  const rawCharactersString = parseWikitext(rawCharactersJSON)
  const rawCharacterList = rawCharactersString.split('\n')
  const trimmedCharacterList = rawCharacterList.slice(1, -3)
  const regex = /(?<=link=)(.*)/g
  const characterList = []
  for (let character of trimmedCharacterList) {
    characterList.push(character.match(regex)[0])
  }
  return characterList
}

export { getCharacters }
