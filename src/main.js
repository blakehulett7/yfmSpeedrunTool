import pl from 'nodejs-polars'
import { equipArray } from '../data/raw/equips.js'
import { champions } from '../data/raw/champions.js'
import { fetchPage } from './dataFetching.js'
import { getCharacters, buildDropTable, buildEquipMap, buildChampions } from './dataParsing.js'
import { writeDropTable, writeEquipMap, writeChampion, writeFarmTable } from './dataWriting.js'
import { buildFarmTable } from './calculations.js'
import { farmSortMenu } from './menus.js'
import { writeFile, readFile, existsSync } from 'node:fs'

console.log("Christ is King!")

async function main() {
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
  if (existsSync('./data/raw/fusions.json')) {
    console.log('fusion data found!')
} else {
    fetchPage('List of Yu-Gi-Oh! Forbidden Memories Fusions (601–722)', 'fusions')
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
      writeChampion(buildChampions(), champion)
    }
  }
  console.log('\nChecking for farmTable...')
  if (existsSync('./data/processed/farmTables/Twin-headed_Thunder_Dragon.csv')) {
    console.log('Twin-headed Thunder Dragon farm table found!')
} else {
    const farmTable = buildFarmTable(buildChampions())
    writeFarmTable(farmTable, 'Twin-headed Thunder Dragon')
  }
  let currentFarmTable = pl.readCSV('./data/processed/farmTables/Twin-headed_Thunder_Dragon.csv')
  console.log('\nYour champion is Twin-headed Thunder Dragon')
  let sortBy
  while (sortBy != 'exit') {
    sortBy = await farmSortMenu()
    if (sortBy != 'exit') {
      console.log(currentFarmTable.sort(sortBy, true).head(10))
    }
  }
}

main()
