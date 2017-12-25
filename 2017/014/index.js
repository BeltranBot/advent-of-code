const { solve1, solve2 } = require('./solve')

const input = 'ffayrhll'
// const input = 'flqrgnkx' // test
main(input)

function main (input) {
  console.time('solve1()')
  let sol1 = solve1(input)
  console.timeEnd('solve1()')
  console.log('Part1:', sol1)
  
  console.time('solve2()')
  let sol2 = solve2(input)
  console.timeEnd('solve2()')
  console.log('Part2: ', sol2)

}