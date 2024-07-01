import { buildDropTable } from './dataParsing.js'

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

const character = 'Seto (FMR)'
writeDropTable(buildDropTable(character), character)

export { writeDropTable }
