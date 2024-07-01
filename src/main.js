import pl from 'nodejs-polars'
import { fetchPage } from './dataFetching.js'
import { getCharacters, buildDropTable } from './dataParsing.js'
import { writeDropTable } from './dataWriting.js'
import { writeFile, readFile, existsSync } from 'node:fs'

console.log("Christ is King!")

function main() {
  console.log('Welcome to the Forbidden Memories Speedrun Tool!')
  console.log('Checking for character list...')
  if (existsSync('./data/raw/characters.json')) {
    console.log('character list found!')
} else {
    fetchPage('Portal:Yu-Gi-Oh! Forbidden Memories characters', 'characters')
}
  const characterList = getCharacters()
  console.log('Checking for character data...')
  for (let character of characterList) {
    let pathName = character.replaceAll(' ', '_')
    if (existsSync(`./data/raw/${pathName}.json`)) {
      console.log(`${character} data found!`)
  } else {
      fetchPage(character, pathName)
  }
  }
  const opponents = []
  console.log('')
  for (let character of characterList) {
    if (buildDropTable(character) != null) {
      opponents.push(character)
  }
  }
  console.log('\nChecking for drop tables...')
  for (let opponent of opponents) {
    let characterPath = opponent.replaceAll(' ', '_');
    if (existsSync(`./data/processed/${characterPath}_dropTable.csv`)) {
      console.log(`${character} drop table found!`)
  } else {
      console.log(`Writing ${character} drop table.`)
      let dfArray = buildDropTable(character)
      writeDropTable(df, character)
  }
  }
}

main()
