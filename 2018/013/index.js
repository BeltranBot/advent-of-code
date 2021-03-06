let fs = require('fs')
const path = require('path')
const { solve1, solve2 } = require('./solve')

const filename = 'input.txt'
// const filename = 'test-input2.txt' // 
// const filename = 'test-input3.txt' // 
// const filename = 'test-input4.txt' // 103,85 88,64
// const filename = 'test-input5.txt' // 32,99 56,31
// const filename = 'test-input6.txt'
// const filename = 'medium-boi.txt'

const input = fs.readFileSync(path.join(__dirname, filename), {
  encoding: 'utf-8'
})

console.time('solve1()')
let sol1 = solve1(input)
console.timeEnd('solve1()')
console.log('Part 1:', sol1)

console.time('solve2()')
let sol2 = solve2(input)
console.timeEnd('solve2()')
console.log('Part 2:', sol2)