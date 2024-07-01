import { readFileSync } from 'node:fs'

function parseWikitext(rawJSON) {
  const rawJsonObject = JSON.parse(rawJSON)
  return rawJsonObject.parse.wikitext['*']
}

function getCharacters() {
  const rawCharacters = readFileSync('./data/characters.json', 'utf8')
  const rawCharactersString = parseWikitext(rawCharacters)
  const rawCharacterList = rawCharactersString.split('\n')
  const trimmedCharacterList = rawCharacterList.slice(1, -3)
  const regex = /(?<=link=)(.*)/g
  const characterList = []
  for (let character of trimmedCharacterList) {
    characterList.push(character.match(regex)[0])
  }
  return characterList
}

export { parseWikitext, getCharacters }
    console.log(`Checking for ${character} data...`)
