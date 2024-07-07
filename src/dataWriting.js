import { writeFileSync } from 'node:fs'
import { buildFarmTable } from './calculations.js'

function writeDropTable(dropTableArray, character) {
  const pathSuffix = ['', '_2nd', '_3rd']
  const characterPath = character.replaceAll(' ', '_')
  for (let i = 0; i < dropTableArray.length; i++) {
    let suffix = pathSuffix[i]
    let path = `./data/processed/dropTables/${characterPath}${suffix}_dropTable.csv`
    dropTableArray[i].writeCSV(path)
    console.log(`Wrote ${character}${suffix.replace('_', ' ')} drop table successfully!`)
  }
}

function writeEquipMap(equipMap) {
  const path = './data/processed/equipMap.json'
  const equipString = JSON.stringify(equipMap)
  writeFileSync(path, equipString)
  console.log('File written successfully!')
}

function writeChampion(championObject, championName) {
  const championPath = championName.replaceAll(' ', '_')
  const path = `./data/processed/champions/${championPath}.json`
  const championString = JSON.stringify(championObject)
  writeFileSync(path, championString)
  console.log('File written successfully!')
}

function writeFarmTable(farmTable, championName) {
  const championPath = championName.replaceAll(' ', '_')
  const path = `./data/processed/farmTables/${championPath}.csv`
  farmTable.writeCSV(path)
  console.log(`Wrote ${championName}'s farm table!`)
}

export { writeDropTable, writeEquipMap, writeChampion, writeFarmTable }
