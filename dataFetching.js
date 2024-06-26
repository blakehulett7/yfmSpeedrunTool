// Let's start by trying to fetch a page from Yugipedia!
// Now, let's fetch the characters page and parse out an array of all characters
import { yourEmailHere } from './contactInfo.js'


async function fetchPage(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'User-Agent': `droprateFetchBot/1.0 (${yourEmailHere})`,
    }
  })
  const content = await response.json()
  return content
}






const testPageTitle = 'Portal:Yu-Gi-Oh! Forbidden Memories characters'
const yugipediaAPI = 'https://yugipedia.com/api.php'
const params = new URLSearchParams({
  'page': testPageTitle,
  'action': 'parse',
  'prop': 'wikitext',
  'format': 'json',
})
const testURL = yugipediaAPI + '?' + params
const content = await fetchPage(testURL)
console.log(content.parse.wikitext['*'])
