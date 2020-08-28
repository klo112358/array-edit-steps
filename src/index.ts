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

function diff(from: string, to: string, equals?: (a: string, b: string) => boolean): Operation<string>[]
function diff<T>(from: T[], to: T[], equals?: (a: T, b: T) => boolean): Operation<T>[]
function diff<T>(
  from: T[] | string, to: T[] | string, equals: (a: T | string, b: T | string) => boolean = (a, b): boolean => a === b
): Operation<T | string>[] {
  const flen = from.length
  const tlen = to.length
  const cs = tlen + 1
  const map: Record<number, number> = {}
  let lastRowDiag: number = -Infinity
  let lastColDiag: number = Infinity
  let diagMap: Record<number, number> = { 0: 0 }
  for (let h = 0;; h += 1) {
    const prevDiagMap = diagMap
    diagMap = {}
    const minD = Math.max(-h, lastRowDiag)
    const maxD = Math.min(h, lastColDiag)
    for (let diag = minD; diag <= maxD; ++diag) {
      const row = prevDiagMap[diag]
      if (row === undefined) continue
      if (row > flen) continue
      if (row + diag > tlen) continue
      let i = row
      let j = row + diag
      map[i * cs + j] = h
      while (i < flen && j < tlen && equals(from[i], to[j])) {
        map[++i * cs + ++j] = h
      }
      if (i === flen && diag > lastRowDiag) {
        lastRowDiag = diag
      }
      if (j === tlen && diag < lastColDiag) {
        lastColDiag = diag
      }
      if (lastRowDiag === lastColDiag) {
        let i = flen - 1
        let j = tlen - 1
        let distance = map[flen * cs + tlen]
        const scripts: Operation<T>[] = new Array(distance)
        let k = -1
        let iv: boolean
        let jv: boolean
        do {
          iv = i > -1
          jv = j > -1
          const d = i * cs + j
          if (iv && jv) {
            const diagD = map[d]
            if (diagD !== undefined && diagD < distance) {
              distance = diagD
              scripts[++k] = ["e", i--, to[j--] as T]
              continue
            }
          }
          if (iv) {
            const vertD = map[d + 1]
            if (vertD !== undefined && vertD < distance) {
              distance = vertD
              scripts[++k] = ["d", i--]
              continue
            }
          }
          if (jv) {
            const horiD = map[d + cs]
            if (horiD !== undefined && horiD < distance) {
              distance = horiD
              scripts[++k] = ["i", i + 1, to[j--] as T]
              continue
            }
          }
          --i
          --j
        } while (iv || jv)
        return scripts
      }
      setDiagMap(diagMap, diag + 1, i)
      setDiagMap(diagMap, diag, i + 1)
      setDiagMap(diagMap, diag - 1, i + 1)
    }
  }
}

export default diff
