const tileDisplay = document.querySelector('.scoreboard')
const loadingDiv = document.querySelector('.loading-bar')
const ROUNDS = 6

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

let currentRow = 0
let currentTile = 0
let word = ''
let isLoading = true
let done = false

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id' , 'guessRow-' + guessRowIndex)
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })

  tileDisplay.append(rowElement)
})

async function init() {

  const res = await fetch('https://words.dev-apis.com/word-of-the-day')
  const resObj = await res.json()
  word = resObj.word.toUpperCase()
  setLoading(false)
  isLoading = false
  wordParts = word.split("");
  
  console.log(word)
  
    document.addEventListener('keydown', (event) => {
      if (done || isLoading)
      // do nothing
      return;
      
      const action = event.key
      
      if (action === 'Enter') {
        commit()
      } else if (action === 'Backspace') {
        deleteLetter()
      } else if ( isLetter(action) ) {
        addLetter(action.toUpperCase())
      } else {
        // do nothing
      }
    })
}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
      const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
      tile.textContent = letter
      guessRows[currentRow][currentTile] = letter
      tile.setAttribute('data', letter)
      currentTile++
      
    }
  }

const deleteLetter = () => {
  if (currentTile > 0) {
      currentTile--
      const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
      tile.textContent = ''
      guessRows[currentRow][currentTile] = ''
      tile.setAttribute('data', '')
  }
}

async function commit() {
  if (currentTile !== 5) {
    return;
  }

  const guessParts = guessRows[currentRow];

  isLoading = true
  setLoading(true)
  const res = await fetch('https://words.dev-apis.com/validate-word', {
    method: 'POST',
    body: JSON.stringify({ word: guessParts.join('')})
  })

  const resObj = await res.json()
  const validWord = resObj.validWord

  isLoading = false
  setLoading(false)

  if (!validWord) {
    markInvalidWord()
    return;
  }

  
  const map = makeMap(wordParts)
  console.log(map)

  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + i);

    if (guessParts[i] === wordParts[i]) {
      tile.classList.add('correct');
      map[guessParts[i]]--
    } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
      tile.classList.add('close');
      map[guessParts[i]]--
    } else {
      tile.classList.add('wrong');
    }
  }

  currentRow++;
  currentTile = 0;

  if (guessParts.join('') === word) {
    alert('You Win!')
    document.querySelector('.title').classList.add('winner')
    done = true;
    return;
  } else if (currentRow === ROUNDS) {
    alert('You Lose! The word was ' + word)
    done = true;
  }
}

function markInvalidWord() {
  alert('Invalid Word!')
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle('hidden', !isLoading)
}

function makeMap (array) {
  const obj = {}
  for (let i = 0; i < array.length; i++) {
    const letter = array[i]
    if (obj[letter]) {
      obj[letter]++
    } else {
      obj[letter] = 1
    }
  }
  return obj
}

init()
