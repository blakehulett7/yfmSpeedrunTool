import { readFileSync } from 'node:fs'
import pl from 'nodejs-polars';

function parseWikitext(rawJSON) {
  const rawJsonObject = JSON.parse(rawJSON)
  try {
    return rawJsonObject.parse.wikitext['*']
  } catch {
    return 'Invalid'
  }}

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
  const characterPath = character.replaceAll(' ', '_')
  const rawJSON = readFileSync(`./data/${characterPath}.json`)
  const wikitext = parseWikitext(rawJSON)
  if (wikitext.includes('==Drops==')) {
    console.log(character + ' ' + true)
    const wikiArray = wikitext.split('==Drops==')
    const dropString = wikiArray[1]
  } else if (wikitext.includes('== Drops ==')) {
    const wikiArray = wikitext.split('== Drops ==')
    const dropString = wikiArray[1]
  } else {
    return 'no drops'
  };
  console.log(dropString)
}

const characterList = getCharacters()
buildDropTable(characterList[1])

export { parseWikitext, getCharacters }
