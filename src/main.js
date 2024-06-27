import { fetchPage } from './dataFetching.js'
import { getCharacters } from './dataParsing.js'
import { writeFile, readFile, existsSync } from 'node:fs'

console.log("Christ is King!")

function main() {
  console.log('Welcome to the Forbidden Memories Speedrun Tool!')
  console.log('Checking for character list...')
  if (existsSync('./data/characters.json')) {
    console.log('character list found!')
  } else {
    fetchPage('Portal:Yu-Gi-Oh! Forbidden Memories characters', 'characters')
  }
  const characterList = getCharacters()
  for (let character of characterList) {
    let pathName = character.replaceAll(' ', '_')
    console.log(`checking for ${character} data...`)
    if (existsSync(`./data/${pathName}.json`)) {
      console.log(`${character} data found!`)
    } else {
      fetchPage(character, pathName)
    }
  }
}

main()
