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
  const rawCharacters = readFileSync('./data/raw/characters.json', 'utf8')
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
  return readFileSync(`./data/raw/${characterPath}.json`)
}

function dropArrayToDataFrame(array) {
  let cardDrops = []
  for (let line of array) {
    if (line.includes(';')) {
      cardDrops.push(line)
    }
  }
  let cardList = []
  let dropList = []
  for (let card of cardDrops) {
    let data = card.split(';')
    cardList.push(data[0]);
    dropList.push(parseInt(data[1]));
  }
  let df = pl.DataFrame(
    {
      card: cardList,
      rate: dropList
    }
  )
  df.rate = df.rate.cast(pl.Int64)
  return df
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
  const sapowArray = dropArray.slice(sapowSliceIndex, bcdSliceIndex)
  const bcdArray = dropArray.slice(bcdSliceIndex, satecSliceIndex)
  const satecArray = dropArray.slice(satecSliceIndex, endIndex)
  let sapowDF = dropArrayToDataFrame(sapowArray)
  sapowDF = sapowDF.rename({'rate': 'SaPow'})
  let bcdDF = dropArrayToDataFrame(bcdArray)
  bcdDF = bcdDF.rename({'rate': 'BCD'})
  let satecDF = dropArrayToDataFrame(satecArray)
  satecDF = satecDF.rename({'rate': 'SaTec'})
  let dropTableCards = sapowDF.card
  dropTableCards = dropTableCards.concat(bcdDF.card)
  dropTableCards = dropTableCards.concat(satecDF.card)
  dropTableCards = dropTableCards.unique()
  let dropTable = pl.DataFrame(
    {
      card: dropTableCards
})
  dropTable = dropTable.join(sapowDF, {how: 'left', on: 'card'})
  dropTable = dropTable.join(bcdDF, {how: 'left', on: 'card'})
  dropTable = dropTable.join(satecDF, {how: 'left', on: 'card'})
  return dropTable
}


export { parseWikitext, getCharacters, buildDropTable }
