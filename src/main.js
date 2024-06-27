import { fetchPage } from './dataFetching.js'
import { writeFile, readFile } from 'node:fs'

console.log("Christ is King!")

function main() {
  fetchPage('Portal:Yu-Gi-Oh! Forbidden Memories characters', 'characters')
}
