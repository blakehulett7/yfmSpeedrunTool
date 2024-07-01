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

function getCharacterJSON(character) {
  const characterPath = character.replaceAll(' ', '_')
  return readFileSync(`./data/${characterPath}.json`)
}

function buildDropTable(character) {
  const rawJSON = getCharacterJSON(character)
  const wikitext = parseWikitext(rawJSON)
  const wikiArray = wikitext.split('\n')
  let sliceIndex = 0
  if (wikiArray.includes('==Drops==')) {
    sliceIndex = wikiArray.indexOf('==Drops==');
} else if (wikiArray.includes('== Drops ==')) {
    sliceIndex = wikiArray.indexOf('== Drops ==');
} else {
    return
}
  const dropArray = wikiArray.slice(sliceIndex, wikiArray.length)
  const sapowSliceIndex = dropArray.indexOf('| pow_sa = ');
  const bcdSliceIndex = dropArray.indexOf('| bcd    = ');
  const satecSliceIndex = dropArray.indexOf('| tec_sa = ');
  const endIndex = dropArray.lastIndexOf('}}')
  console.log(`${sapowSliceIndex}, ${bcdSliceIndex}, ${satecSliceIndex}, ${endIndex}`)
  const sapowArray = dropArray.slice(sapowSliceIndex, bcdSliceIndex)
  const bcdArray = dropArray.slice(bcdSliceIndex, satecSliceIndex)
  const satecArray = dropArray.slice(satecSliceIndex, endIndex)
  console.log(satecArray)
}

const characterList = getCharacters()
buildDropTable(characterList[1])

export { parseWikitext, getCharacters }
