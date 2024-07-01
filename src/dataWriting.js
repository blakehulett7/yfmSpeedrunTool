import { buildDropTable } from './dataParsing.js'

function writeDropTable(dropTable, character) {
  const characterPath = character.replaceAll(' ', '_')
  dropTable.writeCSV(`./data/processed/${characterPath}_dropTable.csv`)
}

export { writeDropTable }
