import pl from 'nodejs-polars'
import { readFileSync, readdirSync } from 'node:fs'

function buildFarmTable(championObject) {
  const keys = Object.keys(championObject)
  const m1Series = pl.Series('m1', championObject.m1)
  const opponents = readdirSync('./data/processed/dropTables')
  console.log(opponents)
}

const tthd = JSON.parse(readFileSync('./data/processed/champions/Twin-headed_Thunder_Dragon.json'))
buildFarmTable(tthd)
