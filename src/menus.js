import { select } from '@inquirer/prompts'

async function farmSortMenu() {
  const answer = await select({
    message: 'Choose your farming priority',
    choices: [
      {
        name: 'Total Farm Score',
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
      },
      {
        name: 'Go Back',
        value: 'exit'
      }
    ]
  })
  return answer
}

async function championMenu() {
  const answer = await select({
    message: 'Select your champion!',
    choices: [
      {
        value: 'Twin-headed Thunder Dragon',
        description: 'Select if you have thunders and dragons!'
      },
      {
        value: 'Ushi Oni',
        description: 'Select if you have jars and spellcasters!'
      },
      {
        value: 'Dark Elf',
        description: 'Select if you have fairies and dark mercuries!'
      },
      {
        name: 'Exit',
        value: 'exit',
        description: 'Exit the program'
      }
    ]
  })
  return answer
}

export { farmSortMenu, championMenu }
