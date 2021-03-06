let fs = require('fs')
const path = require('path')


function writeOutput(output) {
  fs.writeFile(path.join(__dirname, './js_output.txt'), output, function (err) {
    if (err) return console.log(err)
    console.log("finished")
  })
}

function printOutput(matrix, carts, loop) {
  let output = `loop: ${loop}\n`

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      let step = matrix[row][col]
      for (const cart of carts) {
        if (cart.row === row && cart.col === col) {
          step = cart.dir
          break
        }
      }
      output += step
    }
    output += '\n'
  }

  // writeOutput(output)
  console.log(carts[0].dir, carts[0].next_turn)
  console.log(output)

}

const ROADS = {
  '^': '|',
  '>': '-',
  'v': '|',
  '<': '-'
}

const CARTS = [
  '^',
  '>',
  'v',
  '<'
]
const TURNS = {
  left: 'straight',
  straight: 'right',
  right: 'left',
}
const DIRS = {
  '^': {
    left: '<',
    straight: '^',
    right: '>'
  },
  '>': {
    left: '^',
    straight: '>',
    right: 'v'
  },
  'v': {
    left: '>',
    straight: 'v',
    right: '<'
  },
  '<': {
    left: 'v',
    straight: '<',
    right: '^'
  },
}
const STEPS = {
  '^': { row: -1, col: 0 },
  '>': { row: 0, col: 1 },
  'v': { row: 1, col: 0 },
  '<': { row: 0, col: -1 },
}
const CURVES = {
  '/': {
    '^': '>',
    '>': '^',
    'v': '<',
    '<': 'v',
  },
  '\\': {
    '^': '<',
    '>': 'v',
    'v': '>',
    '<': '^',
  }
}

function getCarts(matrix) {
  let carts = []
  let id = 0
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      let dir = matrix[row][col]
      if (CARTS.includes(dir)) {
        carts.push({
          id,
          row,
          col,
          dir,
          next_turn: 'left'
        })
        matrix[row][col] = ROADS[dir]
        id++
      }
    }
  }
  return carts
}

function sortCarts(a, b) {
  if (a.row > b.row) {
    return -1
  } else if (b.row > a.row) {
    return 1
  } else if (a.col > b.col) {
    return -1
  } else if (b.col > a.col) {
    return 1
  }
  return 0
}

function checkCollisions2(carts) {
  for (const a of carts) {
    for (const b of carts) {
      if (a.id === b.id) continue

      if (a.row === b.row && a.col === b.col) {
        return a
      }
      let look_ahead_a = {}
      let step_a = STEPS[a.dir]
      look_ahead_a['row'] = a.row + step_a.row
      look_ahead_a['col'] = a.col + step_a.col
      let look_ahead_b = {}
      let step_b = STEPS[b.dir]
      look_ahead_b['row'] = b.row + step_b.row
      look_ahead_b['col'] = b.col + step_b.col
      let check_1 = look_ahead_a.row === b.row && look_ahead_a.col === b.col
      let check_2 = look_ahead_b.row === a.row && look_ahead_b.col === a.col
      if (check_1 && check_2) {
        return look_ahead_a
      }
    }
  }
  return false
}

function removeCollisions(carts) {
  for (let i = carts.length - 1; i >= 0; i--) {
    if (carts[i].crashed) {
      carts.splice(i, 1)
    }
  }
}

function solve1(input) {
  let matrix = input.split('\n').map(x => x.split(''))
  let carts = getCarts(matrix)
  let loops = 0

  while (true) {

    for (let cart of carts) {
      let step = STEPS[cart.dir]
      cart.row += step.row
      cart.col += step.col

      let spot = matrix[cart.row][cart.col]
      switch (spot) {
        case '+':
          cart.dir = DIRS[cart.dir][cart.next_turn]
          cart.next_turn = TURNS[cart.next_turn]
          break
        case '/':
          cart.dir = CURVES[spot][cart.dir]
          break
        case '\\':
          cart.dir = CURVES[spot][cart.dir]
          break
        default:
          break
      }
    }

    if (cart = checkCollisions2(carts)) {
      console.log('loops:', loops)
      return `${cart.col},${cart.row}`
    }

    carts.sort(sortCarts)
    loops++
  }


  return null

}

function checkCollisions4(carts, a) {
  for(const b of carts) {
    if(a.id === b.id) continue
    if (b.crashed) continue
    if (a.row === b.row && a.col === b.col) {
      a.crashed = true
      b.crashed = true
      return true
    }
  }

  return false
}

function solve2(input) {
  let matrix = input.split('\n').map(x => x.split(''))
  let carts = getCarts(matrix)
  let loops = 0

  while (true) {
    carts.sort(sortCarts)

    for (let i = carts.length - 1; i >= 0 ; i--) {

      let cart = carts[i]
      if (cart.crashed) {
        carts.splice(i, 1)
        continue
      }

      let step = STEPS[cart.dir]
      cart.row += step.row
      cart.col += step.col

      let spot = matrix[cart.row][cart.col]
      switch (spot) {
        case '+':
          cart.dir = DIRS[cart.dir][cart.next_turn]
          cart.next_turn = TURNS[cart.next_turn]
          break
        case '/':
          cart.dir = CURVES[spot][cart.dir]
          break
        case '\\':
          cart.dir = CURVES[spot][cart.dir]
          break
        default:
          break
      }

      if (checkCollisions4(carts, cart)) {
        carts.splice(i, 1)
      }
    }

    removeCollisions(carts)

    if (carts.length === 1) {
      console.log('loops', loops)
      return `${carts[0].col},${carts[0].row}`
    }

    if (carts.length === 0) {
      return 'no carts left'
    }

    loops++
  }

  return null
}

module.exports = {
  solve1, solve2
}

// 76,99

// part 2
// 62,101
// 61,101
// 88,54
// 88,53