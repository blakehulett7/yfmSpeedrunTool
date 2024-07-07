import pl from 'nodejs-polars'
import { equipArray } from '../data/raw/equips.js'
import { champions } from '../data/raw/champions.js'
import { fetchPage } from './dataFetching.js'
import { getCharacters, buildDropTable, buildEquipMap, buildChampionObject } from './dataParsing.js'
import { writeDropTable, writeEquipMap, writeChampion, writeFarmTable } from './dataWriting.js'
import { buildFarmTable } from './calculations.js'
import { farmSortMenu, championMenu } from './menus.js'
import { writeFile, readFile, existsSync } from 'node:fs'

console.log("Christ is King!")

async function main() {
  pl.Config.setTblRows(200)
  console.log('Welcome to the Forbidden Memories Speedrun Tool!')
  console.log('\nChecking for character list...')
  if (existsSync('./data/raw/characters.json')) {
    console.log('character list found!')
} else {
    fetchPage('Portal:Yu-Gi-Oh! Forbidden Memories characters', 'characters')
}
  const characterList = getCharacters()
  console.log('\nChecking for character data...')
  for (let character of characterList) {
    let characterPath = character.replaceAll(' ', '_')
    let pathName = `characters/${characterPath}`
    if (existsSync(`./data/raw/${pathName}.json`)) {
      console.log(`${character} data found!`)
  } else {
      fetchPage(character, pathName)
  }
  }
  const opponents = []
  for (let character of characterList) {
    if (buildDropTable(character) != null) {
      opponents.push(character)
    }
  }
  console.log('\nChecking for equips data...')
  for (let equip of equipArray) {
    let equipPath = equip.replaceAll(' ', '_')
    if (existsSync(`./data/raw/equips/${equipPath}_(FMR).json`)) {
      console.log(`${equip} data found!`)
  } else {
      let equipTitle = `${equip} (FMR)`
      let pathName = `equips/${equipPath}_(FMR)`
      fetchPage(equipTitle, pathName)
    }
  }
  console.log('\nChecking for fusion data...')
  if (existsSync('./data/raw/fusions1.json')) {
    console.log('fusion data found!')
} else {
    fetchPage('List of Yu-Gi-Oh! Forbidden Memories Fusions (401–600)', 'fusions1')
  }
  if (existsSync('./data/raw/fusions2.json')) {
    console.log('fusion data found!')
} else {
    fetchPage('List of Yu-Gi-Oh! Forbidden Memories Fusions (601–722)', 'fusions2')
  }
  console.log('\nChecking for drop tables...')
  for (let opponent of opponents) {
    let characterPath = opponent.replaceAll(' ', '_');
    if (existsSync(`./data/processed/dropTables/${characterPath}_dropTable.csv`)) {
      console.log(`${opponent} drop table found!`)
  } else {
      let dfArray = buildDropTable(opponent)
      writeDropTable(dfArray, opponent)
    }
  }
  console.log('\nChecking for equip map...')
  if (existsSync('./data/processed/equipMap.json')) {
    console.log('equip map found!')
} else {
    writeEquipMap(buildEquipMap())
  }
  console.log('\nChecking for champions...')
  for (let champion of champions) {
    let championPath = champion.replaceAll(' ', '_')
    let pathName = `./data/processed/champions/${championPath}.json`
    if (existsSync(pathName)) {
      console.log(`${champion} found!`)
  } else {
      writeChampion(buildChampionObject(champion), champion)
    }
  }
  console.log('\nChecking for farmTables...')
  let farmTables = []
  for (let champion of champions) {
    let championPath = champion.replaceAll(' ', '_')
    if (existsSync(`./data/processed/farmTables/${championPath}.csv`)) {
      console.log(`${champion} farm table found!`)
  } else {
      const farmTable = buildFarmTable(buildChampionObject(champion))
      writeFarmTable(farmTable, champion)
    }
    let currentFarmTable = pl.readCSV(`./data/processed/farmTables/${championPath}.csv`)
    farmTables.push(currentFarmTable)
  }
  const championFarmTableMap = {
    'Twin-headed Thunder Dragon': 0,
    'Ushi Oni': 1,
    'Dark Elf': 2,
    'Mystical Sand': 3
  }
  let myChampion;
  console.log('')
  while (myChampion != 'exit') {
    myChampion = await championMenu()
    if (myChampion === 'exit') {
      return
    }
    let farmTableIndex = championFarmTableMap[myChampion]
    let farmTable = farmTables[farmTableIndex]
    let sortBy
    while (sortBy != 'exit') {
      sortBy = await farmSortMenu()
      if (sortBy != 'exit') {
        console.log(farmTable.sort(sortBy, true))
      }
    }
  }
}

main()
