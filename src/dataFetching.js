// Let's start by trying to fetch a page from Yugipedia!
// Now, let's fetch the characters page and parse out an array of all characters
import { yourEmailHere } from '../contactInfo.js'
import { writeFile } from 'node:fs'

async function fetchPage(pageTitle) {
  const yugipediaAPI = 'https://yugipedia.com/api.php'
  const params = new URLSearchParams({
    'page': pageTitle,
    'action': 'parse',
    'prop': 'wikitext',
    'format': 'json',
  })
  const url = yugipediaAPI + '?' + params
  console.log(`Fetching data from ${url}...`)
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'User-Agent': `droprateFetchBot/1.0 (${yourEmailHere})`,
    }
  })
  const content = await response.json()
  const wikitext = await content.parse.wikitext['*']
  writeFile('./data/characters.js', wikitext, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('file written successfully!')
    }
  })
}

export { fetchPage }
