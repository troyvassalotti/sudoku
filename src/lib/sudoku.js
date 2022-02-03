import {makepuzzle, solvepuzzle} from 'sudoku'

/*
  Generates a sudoku with the structure
  {rows: [{index: 0, cols: [{row: 0, col: 0, value: 1, readonly: true}, ...]}, ...]}
*/
export function generateSudoku() {
    const fromUrl = extractUrlData()

    const raw = fromUrl ? fromUrl.raw : makepuzzle()
    const rawSolution = solvepuzzle(raw)

    const formatted = raw.map(e => (e === null ? null : e + 1))
    const formattedSolution = rawSolution.map(e => e + 1)

    const result = {
        raw,
        rows: [],
        solution: formattedSolution,
        startTime: new Date(),
        solvedTime: null,
        challengerStartTime: fromUrl && new Date(fromUrl.startTime),
        challengerSolvedTime: fromUrl && new Date(fromUrl.solvedTime)
    }

    for (let i = 0; i < 9; i++) {
        const row = {cols: [], index: i}
        for (let j = 0; j < 9; j++) {
            const value = formatted[i * 9 + j]
            const col = {
                row: i,
                col: j,
                value: value,
                readonly: value !== null
            }
            row.cols.push(col)
        }
        result.rows.push(row)
    }

    return result
}

/**
 * Evaluate the current solution against the solution
 * @param sudoku
 * @returns {boolean}
 */
export function checkSolution(sudoku) {
    const candidate = sudoku.rows.map((row) => row.cols.map((col) => col.value)).flat()

    for (let i = 0; i < candidate.length; i++) {
        if (candidate[i] === null || candidate[i] !== sudoku.solution[i]) {
            return false
        }
    }

    return true
}

/**
 * Take the last edited field and add the proper class to it
 * @param field
 * @param sudoku
 */
export function highlightCell(field, sudoku) {
    const value = field.value
    const solvedValue = sudoku.solution[field.row * 9 + field.col]
    if (value === solvedValue) {
        field.el.classList.contains("wrong") ? field.el.classList.remove("wrong") : false
        field.el.classList.add("correct")
    } else {
        field.el.classList.contains("correct") ? field.el.classList.remove("correct") : false
        field.el.classList.add("wrong")
    }
}

/**
 * Create a URL for your sudoku to share with someone else
 * @param sudoku
 * @returns {string}
 */
export function shareUrl(sudoku) {
    const data = {
        raw: sudoku.raw,
        startTime: sudoku.startTime,
        solvedTime: sudoku.solvedTime
    }

    const query = btoa(JSON.stringify(data))

    return document.location.href.replace(/\?.+$/, "") + `?sudoku=${query}`
}

function extractUrlData() {
    const match = document.location.search.match(/\?sudoku=([^&]+)/)

    if (match) {
        return JSON.parse(atob(match[1]))
    }

    return null
}