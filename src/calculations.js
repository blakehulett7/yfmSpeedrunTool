import pl from 'nodejs-polars'
import { readFileSync, readdirSync } from 'node:fs'

function buildFarmTable(championObject) {
  const keys = Object.keys(championObject)
  let farmTable = null
  for (let key of keys) {
    const groupData = pl.DataFrame(championObject[key], {columns: ['card']})
    const opponents = readdirSync('./data/processed/dropTables')
    let farmRow = pl.DataFrame([key], {columns: ['Group']})
    for (let opponent of opponents) {
      let dropTable = pl.readCSV(`./data/processed/dropTables/${opponent}`)
      let trimmedTable = groupData.join(dropTable, {on: 'card', how: 'left'})
      let farmScore = trimmedTable.sum()
      let title = opponent.replace('_(FMR)_dropTable.csv', '')
      title = title.replace('_dropTable.csv', '')
      title = title.replaceAll('_', ' ')
      farmScore = farmScore.rename({'card': 'Group', 'SaPow': `${title}\nSaPow`, 'BCD': `${title}\nBCD`, 'SaTec': `${title}\nSaTec`})
      farmScore = farmScore.withColumns(pl.col('Group').replace(null, key))
      farmRow = farmRow.join(farmScore, {on: 'Group', how: 'left'})
    }
    if (farmTable != null) {
      farmTable = pl.concat([farmTable, farmRow])
  } else {
      farmTable = farmRow
    }
  }
  console.log(farmTable)
  console.log(farmTable.sum())
}

const tthd = JSON.parse(readFileSync('./data/processed/champions/Twin-headed_Thunder_Dragon.json'))
buildFarmTable(tthd)
