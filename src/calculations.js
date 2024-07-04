import pl from 'nodejs-polars'
import { readFileSync, readdirSync } from 'node:fs'

function buildFarmTable(championObject) {
  const keys = Object.keys(championObject)
  const m1Df = pl.DataFrame(championObject.m1, {columns: ['card']})
  const opponents = readdirSync('./data/processed/dropTables')
  for (let opponent of opponents) {
    let dropTable = pl.readCSV(`./data/processed/dropTables/${opponent}`)
    let trimmedTable = m1Df.join(dropTable, {on: 'card', how: 'left'})
    let farmScore = trimmedTable.sum()
    let title = opponent.replace('_(FMR)_dropTable.csv', '')
    title = title.replace('_dropTable.csv', '')
    title = title.replaceAll('_', ' ')
    farmScore = farmScore.rename({'card': 'Group', 'SaPow': `${title}\nSaPow`, 'BCD': `${title}\nBCD`, 'SaTec': `${title}\nSaTec`})
    farmScore = farmScore.withColumns(pl.col('Group').replace(null, 'm1'))
    console.log(farmScore)
  }
  const df = pl.DataFrame(['m1'], {columns: ['Group']})
  console.log(df)
}

const tthd = JSON.parse(readFileSync('./data/processed/champions/Twin-headed_Thunder_Dragon.json'))
buildFarmTable(tthd)
