import pl from 'nodejs-polars'
import { readFileSync, readdirSync } from 'node:fs'

function buildFarmTable(championObject) {
  const keys = Object.keys(championObject)
  const m1Df = pl.DataFrame(championObject.m1, {columns: ['card']})
  const opponents = readdirSync('./data/processed/dropTables')
  let dropTables = []
  const dt = pl.readCSV(`./data/processed/dropTables/${opponents[0]}`)
  const result = m1Df.join(dt, {on: 'card', how: 'left'})
  let sums = result.sum()
  console.log(sums)
}

const tthd = JSON.parse(readFileSync('./data/processed/champions/Twin-headed_Thunder_Dragon.json'))
buildFarmTable(tthd)
