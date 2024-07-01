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

function dropArrayToDropTable(dropArray) {
  let sapowSliceIndex = 0
  let bcdSliceIndex = 0
  let satecSliceIndex = 0
  for (let element of dropArray) {
    if (element.startsWith('| p')) {
      sapowSliceIndex = dropArray.indexOf(element)
  } else if (element.startsWith('| b')) {
      bcdSliceIndex = dropArray.indexOf(element)
  } else if (element.startsWith('| t')) {
      satecSliceIndex = dropArray.indexOf(element)
      break
  }
  }
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

function buildDropTable(character) {
  let characterName = character
  if (character.includes(' (FMR)')) {
    characterName = character.replace(' (FMR)', '')
  }
  const rawJSON = getCharacterJSON(character)
  const wikitext = parseWikitext(rawJSON)
  const wikiArray = wikitext.split('\n')
  let sliceIndex = 0
  if (wikiArray.includes('==Drops==')) {
    sliceIndex = wikiArray.indexOf('==Drops==');
} else if (wikiArray.includes('== Drops ==')) {
    sliceIndex = wikiArray.indexOf('== Drops ==');
} else {
    return null
}
  const dropArray = wikiArray.slice(sliceIndex, wikiArray.length)
  let dropArrayList = []
  if (dropArray.includes(`===${characterName} 3rd===`)) {
    let sliceIndex2 = dropArray.indexOf(`===${characterName} 3rd===`)
    sliceIndex = dropArray.indexOf(`===${characterName} 2nd===`)
    dropArrayList.push(dropArray.slice(0, sliceIndex))
    dropArrayList.push(dropArray.slice(sliceIndex, sliceIndex2))
    dropArrayList.push(dropArray.slice(sliceIndex2, dropArray.length))
} else if (dropArray.includes(`===${characterName} 2nd===`)) {
    sliceIndex = dropArray.indexOf(`===${characterName} 2nd===`)
    dropArrayList.push(dropArray.slice(0, sliceIndex))
    dropArrayList.push(dropArray.slice(sliceIndex, dropArray.length))
} else {
    dropArrayList.push(dropArray)
}
  let dropTableList = []
  for (let i of dropArrayList) {
    dropTableList.push(dropArrayToDropTable(i))
  }
  return dropTableList
}


export { parseWikitext, getCharacters, buildDropTable }
