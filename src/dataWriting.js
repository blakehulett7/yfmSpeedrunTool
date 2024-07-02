import { writeFileSync } from 'node:fs'
import { buildFusionList } from './dataParsing.js'

function writeDropTable(dropTableArray, character) {
  const pathSuffix = ['', '_2nd', '_3rd']
  const characterPath = character.replaceAll(' ', '_')
  for (let i = 0; i < dropTableArray.length; i++) {
    let suffix = pathSuffix[i]
    let path = `./data/processed/${characterPath}${suffix}_dropTable.csv`
    dropTableArray[i].writeCSV(path)
    console.log(`Wrote ${character}${suffix.replace('_', ' ')} drop table successfully!`)
  }
}

function writeFusionObject(fusionObject, fusionMonsterName) {
  const path = `./data/processed/${fusionMonsterName}FusionArray.json`
  const fusionString = JSON.stringify(fusionObject)
  writeFileSync(path, fusionString)
  console.log('File written successfully!')
}

export { writeDropTable }
