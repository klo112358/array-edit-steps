export type InsertOperation<T> = ["i", number, T]
export type EditOperation<T> = ["e", number, T]
export type DeleteOperation = ["d", number]
export type Operation<T> = InsertOperation<T> | EditOperation<T> | DeleteOperation

function setDiagMap(diagMap: Record<number, number>, diag: number, row: number): void {
  const v = diagMap[diag]
  if (v === undefined || v < row) {
    diagMap[diag] = row
  }
}
type Table = Record<number, Record<number, number>>

function get(map: Table, i: number, j: number): number {
  const m = map[i]
  if (m === undefined) return Infinity
  const v = m[j]
  if (v === undefined) return Infinity
  return v
}

function set(map: Table, i: number, j: number, v: number): void {
  if (map[i] === undefined) {
    map[i] = {}
  }
  map[i][j] = v
}

function generateEditScript<T>(from: T[] | string, to: T[] | string, map: Table): Operation<T | string>[] {
  const flen = from.length
  const tlen = to.length
  const scripts: Operation<T>[] = []
  let i = flen - 1
  let j = tlen - 1
  let distance = map[i][j]
  do {
    const diagD = get(map, i - 1, j - 1)
    if (diagD < distance) {
      distance = diagD
      scripts.push(["e", i, to[j] as T])
      i -= 1
      j -= 1
      continue
    }
    const vertD = get(map, i - 1, j)
    if (vertD < distance) {
      distance = vertD
      scripts.push(["d", i])
      i -= 1
      continue
    }
    const horiD = get(map, i, j - 1)
    if (horiD < distance) {
      distance = horiD
      scripts.push(["i", i + 1, to[j] as T])
      j -= 1
      continue
    }
    i -= 1
    j -= 1
  } while (i >= -1 && j >= -1)
  return scripts
}

function diff(from: string, to: string, equals?: (a: string, b: string) => boolean): Operation<string>[]
function diff<T>(from: T[], to: T[], equals?: (a: T, b: T) => boolean): Operation<T>[]
function diff<T>(
  from: T[] | string, to: T[] | string, equals: (a: T | string, b: T | string) => boolean = (a, b): boolean => a === b
): Operation<T | string>[] {
  const flen = from.length
  const tlen = to.length
  const map: Table = {}
  let lastRowDiag: number = -Infinity
  let lastColDiag: number = Infinity
  function slide(diag: number, row: number, value: number): number {
    set(map, row, row + diag, value)
    let i = row + 1
    let j = row + diag + 1
    while (i < flen && j < tlen && equals(from[i], to[j])) {
      set(map, i, j, value)
      i += 1
      j += 1
    }
    if (i === flen && diag > lastRowDiag) {
      lastRowDiag = diag
    }
    if (j === tlen && diag < lastColDiag) {
      lastColDiag = diag
    }
    return i - 1
  }
  let diagMap: Record<number, number> = { 0: -1 }
  for (let h = 0;; h += 1) {
    const prevDiagMap = diagMap
    diagMap = {}
    const minD = Math.max(-h, lastRowDiag)
    const maxD = Math.min(h, lastColDiag)
    for (let diag = minD; diag <= maxD; diag += 1) {
      const row = prevDiagMap[diag]
      if (row === undefined) continue
      if (row >= flen) continue
      if (row + diag >= tlen) continue
      const newRow = slide(diag, row, h)
      if (lastRowDiag === lastColDiag) break
      setDiagMap(diagMap, diag + 1, newRow)
      setDiagMap(diagMap, diag, newRow + 1)
      setDiagMap(diagMap, diag - 1, newRow + 1)
    }
    if (lastRowDiag === lastColDiag) break
  }
  // console.log("  " + (typeof to === "string" ? to.split("") : to).join(" "))
  // for (let a = 0; a < flen; a += 1) {
  //   const s: string[] = [String(from[a])]
  //   for (let b = 0; b < tlen; b += 1) {
  //     const v = get(map, a, b)
  //     if (Number.isFinite(v)) {
  //       s.push(String(v))
  //     } else {
  //       s.push("x")
  //     }
  //   }
  //   console.log(s.join(" "))
  // }
  return generateEditScript(from, to, map)
}

export default diff
