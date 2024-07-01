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

function buildDropTable(character) {
  const rawJSON = readFileSync(`./data/${character}.json`)
  const wikitext = parseWikitext(rawJSON)
  const wikiArray = wikitext.split('==Drops==')
  console.log(wikiArray[1])
}

const characterList = getCharacters()
buildDropTable(characterList[1].replaceAll(' ', '_'))

export { parseWikitext, getCharacters }
