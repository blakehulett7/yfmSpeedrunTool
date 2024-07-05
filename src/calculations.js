import pl from 'nodejs-polars'
import { readFileSync, readdirSync } from 'node:fs'

function buildFarmTable(championObject) {
  const keys = Object.keys(championObject)
  const opponents = readdirSync('./data/processed/dropTables')
  let farmTable = null
  for (let key of keys) {
    const groupData = pl.DataFrame(championObject[key], {columns: ['card']})
    let farmRow = pl.DataFrame([key], {columns: ['Group']})
    for (let opponent of opponents) {
      let dropTable = pl.readCSV(`./data/processed/dropTables/${opponent}`)
      let trimmedTable = groupData.join(dropTable, {on: 'card', how: 'left'})
      trimmedTable = trimmedTable.withColumn(pl.col('SaPow').cast(pl.Int64))
      let farmScore = trimmedTable.sum()
      let title = opponent.replace('_(FMR)_dropTable.csv', '')
      title = title.replace('_dropTable.csv', '')
      title = title.replace('_(FMR)', '')
      title = title.replaceAll('_', ' ')
      farmScore = farmScore.rename({'card': 'Group', 'SaPow': `${title} Pow`, 'BCD': `${title} Bcd`, 'SaTec': `${title} Tec`})
      farmScore = farmScore.withColumns(pl.col('Group').replace(null, key))
      farmRow = farmRow.join(farmScore, {on: 'Group', how: 'left'})
    }
    if (farmTable != null) {
      farmTable = pl.concat([farmTable, farmRow])
  } else {
      farmTable = farmRow
    }
  }
  let sumRow = farmTable.sum()
  sumRow = sumRow.withColumns(pl.col('Group').replace(null, 'Total'))
  farmTable = pl.concat([farmTable, sumRow])
  let filteredFarmTable = farmTable.drop(['Nitemare Pow', 'Nitemare Tec', 'Nitemare Bcd'])
  const columns = farmTable.Group
  farmTable = farmTable.drop('Group')
  filteredFarmTable = filteredFarmTable.drop('Group')
  farmTable = farmTable.transpose({
    includeHeader: true,
    columnNames: columns
  })
  filteredFarmTable = filteredFarmTable.transpose({
    includeHeader: true,
    columnNames: columns
  })
  farmTable = farmTable.rename({'column': 'Opponent'})
  filteredFarmTable = filteredFarmTable.rename({'column': 'Opponent'})
  return filteredFarmTable
  //console.log(filteredFarmTable.sort('Total', true).head(10))
}

export { buildFarmTable }
