let fs = require('fs')
const path = require('path')

function writeOutput(output) {
  fs.writeFile(path.join(__dirname, './js_output.txt'), output, function (err) {
    if (err) return console.log(err)
    console.log("finished")
  })
}

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function printMatrix(matrix) {
  let output = ''

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      output += matrix[row][col].value ? matrix[row][col].value : '.'
    }
    output += '\n'
  }
  return output
}

function solve1(input) {
  input = input.split('\n').map(x => x.split(', ').map(x => +x))
  let max_x = -Infinity
  let max_y = -Infinity
  let id = 1
  let ids = []


  for (const [x, y] of input) {
    if (x > max_x) max_x = x
    if (y > max_y) max_y = y
    ids.push({ id, pos: [y, x], is_infinity: false, area: 0 })
    id++
  }

  for (let row = 0; row < max_y + 1; row++) {
    for (let col = 0; col < max_x + 1; col++) {
      let winner_id = null
      let min_length = Infinity
      for (let id of ids) {
        let manhattan = manhattanDistance(id.pos, [row, col])
        if (manhattan < min_length) {
          min_length = manhattan
          winner_id = id
        }
      }

      if (winner_id.is_infinity) continue

      if (row === 0 || col === 0 || row === max_x || col === max_y) {
        winner_id.is_infinity = true
        winner_id.area = 0
        continue
      }

      winner_id.area++
    }
  }

  let winner_id = null
  for (const id of ids) {
    if (id.is_infinity) continue
    if (!winner_id) {
      winner_id = id
      continue
    }
    if (id.area > winner_id.area) {
      winner_id = id
    }
  }
  
  return winner_id.area
}

function solve3(input) {
  input = input.split('\n').map(x => x.split(', ').map(x => +x))

  let max_x = -Infinity
  let max_y = -Infinity
  let ids = []
  let id = 1
  for (const [x, y] of input) {
    if (x > max_x) max_x = x
    if (y > max_y) max_y = y
    ids.push({ id: id++, pos: [y, x], is_infinity: false, count: 0 })
  }

  let matrix = [...Array(max_y + 1)]
    .map(x => [...Array(max_x + 1)].map(x => { return { value: 0 } }))

  id = 1

  for (const [x, y] of input) {
    matrix[y][x].value = id++
  }

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col].value !== 0) continue
      let manhattans = []
      for (const [x, y] of input) {
        manhattans.push(manhattanDistance([row, col], [y, x]))
      }
      let min = Math.min(...manhattans)
      min = manhattans.filter(x => x === min)

      if (min.length === 1) {
        let index = manhattans.indexOf(min[0])
        if (row === 0 || col === 0 || row === matrix.length - 1 || col === matrix[0].length - 1) {
          ids[index].is_infinity = true
        }
        let [y, x] = ids[index].pos
        matrix[row][col].value = matrix[y][x].value
      }
    }
  }

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      let id = ids.filter(x => x.id === matrix[row][col].value)
      if (id.length === 0) continue
      if (id[0].is_infinity) {
        matrix[row][col] = 0
        continue
      }
      id[0].count++
    }
  }

  writeOutput(printMatrix(matrix))
  return ids.reduce((a, c) => c.count > a ? c.count : a, -Infinity)

}

function solve2(input, max_distance = 10000) {
  input = input.split('\n').map(x => x.split(', ').map(x => +x))

  let max_x = -Infinity
  let max_y = -Infinity

  for (const [x, y] of input) {
    if (x > max_x) max_x = x
    if (y > max_y) max_y = y
  }

  let area = 0
  for (let row = 0; row < max_y + 1; row++) {
    for (let col = 0; col < max_y + 1; col++) {
      let manhattans = 0
      for (const [x, y] of input) {
        manhattans += manhattanDistance([row, col], [y, x])
      }
      if (manhattans < max_distance) {
        area++
      }
    }
  }
  // writeOutput(printMatrix(matrix))
  return area

}

module.exports = {
  solve1, solve2
}