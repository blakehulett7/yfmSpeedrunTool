import { readFileSync } from 'node:fs'
import pl from 'nodejs-polars';
import { equipArray } from '../data/raw/equips.js'
import { fieldMap } from '../data/raw/fields.js'
import { removals } from '../data/raw/removals.js'
import { champions } from '../data/raw/champions.js'

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
  return readFileSync(`./data/raw/characters/${characterPath}.json`)
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

function buildEquipList(equip) {
  const equipPath = equip.replaceAll(' ', '_')
  const rawJSON = readFileSync(`./data/raw/equips/${equipPath}_(FMR).json`)
  const wikiText = parseWikitext(rawJSON)
  const verticalRegex = /(?<=\| targets.*=.*\n)([\s\S]*)(?=}})/gm
  const horizontalRegex = /(?<=\* )[^].*/g
  const wikiTrim = wikiText.match(verticalRegex)
  let wikiArray = wikiTrim[0].split('\n')
  wikiArray = wikiArray.slice(0, wikiArray.length - 1)
  const equipList = []
  for (let line of wikiArray) {
    equipList.push(line.match(horizontalRegex)[0])
  }
  return equipList
}

function buildEquipMap() {
  let equipMap = {}
  for (let equip of equipArray) {
    equipMap[equip] = buildEquipList(equip)
  }
  return equipMap
}

function buildChampionObject(championName) {
  const championIDs = {
    'Ushi Oni': 401,
    'Twin-headed Thunder Dragon': 613,
    'Dark Elf': 551
  }
  const championID = championIDs[championName]
  const fusion1Champions = ['Ushi Oni', 'Dark Elf']
  const fusion2Champions = ['Twin-headed Thunder Dragon']
  const fusionJSON1 = readFileSync('./data/raw/fusions1.json')
  const fusionJSON2 = readFileSync('./data/raw/fusions2.json')
  let wikiText
  if (fusion1Champions.includes(championName)) {
    wikiText = parseWikitext(fusionJSON1)
  }
  else if (fusion2Champions.includes(championName)){
    wikiText = parseWikitext(fusionJSON2);
  }
  let wikiArray = wikiText.split('\n')
  let startIndex = wikiArray.indexOf(`== ${championID}: "${championName}" ==`)
  wikiArray = wikiArray.slice(startIndex, wikiArray.length)
  let endIndex = wikiArray.indexOf('}}')
  wikiArray = wikiArray.slice(0, endIndex)
  const sliceArray = []
  for (let line of wikiArray) {
    if (line.startsWith('| f')) {
      sliceArray.push(wikiArray.indexOf(line))
    }
  }
  const slices = []
  for (let i = 0; i < sliceArray.length - 1; i++) {
    startIndex = sliceArray[i]
    endIndex = sliceArray[i+1]
    slices.push(wikiArray.slice(startIndex, endIndex))
  }
  startIndex = sliceArray[sliceArray.length - 1]
  endIndex = wikiArray.length
  slices.push(wikiArray.slice(startIndex, endIndex))
  let m1Array = []
  let m2Array = []
  const regex = /(?<=\[\[)(.*)(?=\|)/g
  for (let i = 0; i < slices.length; i += 2) {
    let fusionArray = slices[i].slice(1, slices[i].length)
    for (let material of fusionArray) {
      try {
      m1Array.push(material.match(regex)[0])
      }
      catch {
        m1Array = [
        'Dragon Piper (FMR)',
        'Ancient Jar (FMR)',
        'Pot the Trick (FMR)',
        'Morphing Jar (FMR)'
        ]
      }
    }
  }
  m1Array = Array.from(new Set(m1Array)) 
  for (let i = 1; i < slices.length; i += 2) {
    let fusionArray = slices[i].slice(1, slices[i].length - 1)
    for (let material of fusionArray) {
      m2Array.push(material.match(regex)[0])
    }
  }
  m2Array = Array.from(new Set(m2Array))
  const equipMap = JSON.parse(readFileSync('./data/processed/equipMap.json'))
  const equipList = []
  for (let equip of equipArray) {
    let checkList = equipMap[equip]
    if (checkList.includes(`${championName} (FMR)`)) {
      equipList.push(`${equip} (FMR)`)
    }
  }
  equipList.push('Bright Castle (FMR)');
  equipList.push('Megamorph (FMR)');
  const fieldList = []
  for (let field of Object.keys(fieldMap)) {
    const check = fieldMap[field].includes(`${championName} (FMR)`)
    if (check) {
      fieldList.push(field)
    }
  }
  const championObject = {
    m1: m1Array,
    m2: m2Array,
    equips: equipList,
    fields: fieldList,
    removals: removals
  }
  return championObject
}

export { parseWikitext, getCharacters, buildDropTable, buildEquipMap, buildChampionObject }
