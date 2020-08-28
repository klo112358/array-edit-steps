import diff, { Operation } from "../src"
import chai, { expect } from "chai"
import chaiThings from "chai-things"

chai.should()
chai.use(chaiThings)

const segments = ["a", "bc", "def", "ghij", "klmno", "ab", "cde", "fghi", "jkmnl"]

function randInt(max: number): number {
  return Math.floor(Math.random() * max)
}

function randString(): string {
  return Array.from({ length: randInt(10) + 1 }).map(() => {
    const i = randInt(segments.length)
    return segments[i]
  }).join("")
}

function process(original: string, steps: Operation<string>[]): string {
  const arr = original.split("")
  steps.forEach(([op, i, v]) => {
    if (op === "d") {
      arr.splice(i, 1)
    } else if (op === "i") {
      arr.splice(i, 0, v as string)
    } else {
      arr.splice(i, 1, v as string)
    }
  })
  return arr.join("")
}

const identical = [
  ["", ""],
  ...Array.from({ length: 9 }).map(() => {
    const s = randString()
    return [s, s]
  }),
]

describe("Test identical", () => {
  identical.forEach(([from, to], i) => {
    it(`test #${i + 1}: "${from}" -> "${to}"`, () => {
      const result = diff(from, to)
      expect(result).to.be.an("array").that.has.lengthOf(0)
    })
  })
})

const reduceOnly = [
  ["abcd", ""],
  ["abcd", "bcd"],
  ["abcd", "abc"],
  ["abcd", "acd"],
  ["abcd", "ab"],
  ["abcd", "cd"],
  ["abcd", "ad"],
  ["abcd", "a"],
  ["abcd", "d"],
  ["abcd", "b"],
  ["abcddcbaabcd", "abddcaabc"],
  ["abcddcbaabcd", "bddcaabcd"],
  ["abcddcbaabcd", "bddcaabc"],
]

describe("Test delete only", () => {
  reduceOnly.forEach(([from, to], i) => {
    it(`test #${i + 1}: "${from}" -> "${to}"`, () => {
      const result = diff(from, to)
      expect(result).to.be.an("array").that.has.lengthOf(from.length - to.length)
      expect(to).equals(process(from, result))
      result.should.all.have.property("0", "d")
    })
  })
})

const editOnly = [
  ["a", "b"],
  ["abcd", "efgh"],
  ["abcd", "abce"],
  ["abcd", "abcc"],
  ["abcd", "ebcd"],
  ["abcd", "bbcd"],
  ["abcd", "aecd"],
  ["abcd", "accd"],
  ["abcd", "aacd"],
  ["abcd", "abab"],
  ["abcd", "eecd"],
  ["abcd", "addd"],
  ["abcddcbaabcd", "abcddcbbbbcd"],
  ["abcddcbaabcd", "accdccbaadcd"],
  ["abcddcbaabcd", "accddcdaadcd"],
]

describe("Test edit only", () => {
  editOnly.forEach(([from, to], i) => {
    it(`test #${i + 1}: "${from}" -> "${to}"`, () => {
      const result = diff(from, to)
      expect(result).to.be.an("array")
      expect(to).equals(process(from, result))
      result.should.all.have.property("0", "e")
    })
  })
})

describe("Test random", () => {
  Array.from({ length: 20 }).map((_, i) => {
    const from = randString()
    const to = randString()
    it(`test #${i + 1}: "${from}" -> "${to}"`, () => {
      const result = diff(from, to)
      expect(result).to.be.an("array")
      expect(to).equals(process(from, result))
    })
  })
})
