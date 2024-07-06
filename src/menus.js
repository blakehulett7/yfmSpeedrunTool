import { select } from '@inquirer/prompts'

async function farmSortMenu() {
  const answer = await select({
    message: 'Choose your farming priority',
    choices: [
      {
        name: 'Total farm score',
        value: 'Total',
        description: 'Find the best opponents to farm overall'
      },
      {
        name: 'Thunders',
        value: 'm1',
        description: 'Find the best opponents to farm for Thunders'
      },
      {
        name: 'Dragons',
        value: 'm2',
        description: 'Find the best opponents to farm for Dragons'
      },
      {
        name: 'Equip Cards',
        value: 'equips',
        description: 'Find the best opponents to farm for valid equip cards'
      },
      {
        name: 'Field Cards',
        value: 'fields',
        description: 'Find the best opponents to farm for valid field spell cards'
      },
      {
        name: 'Removal Cards',
        value: 'removals',
        description: 'Find the best opponents to farm for Removal Cards'
      }
    ]
  })
  return answer
}

export { farmSortMenu }
