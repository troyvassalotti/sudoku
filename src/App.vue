<script setup>
import {reactive} from 'vue'
import {generateSudoku, checkSolution, highlightCell, shareUrl} from './lib/sudoku'
import SudokuBoard from './components/SudokuBoard.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'

const store = {
  state: reactive({
    sudoku: generateSudoku(),
    showProgress: false,
    previousSudoku: null,
  }),

  /**
   * Receives events from the individual fields to either highlight cells or check solutions
   * @param e - Event
   */
  handleChange(e) {
    store.state.sudoku.rows[e.row].cols[e.col].value = e.value
    highlightCell(e, store.state.sudoku)
    if (!store.state.sudoku.solvedTime) {
      const solved = checkSolution(store.state.sudoku)
      if (solved) {
        store.state.sudoku.solvedTime = new Date()
        store.state.sudoku.shareUrl = shareUrl(store.state.sudoku)
      }
    }
  },

  /**
   * Instantly solve the sudoku
   * @function
   */
  solveSudoku() {
    store.state.sudoku.rows.forEach(row => {
      row.cols.forEach(col => {
        col.value = store.state.sudoku.solution[col.row * 9 + col.col]
      })
    })
    store.state.sudoku.solvedTime = new Date()
    store.state.sudoku.shareUrl = shareUrl(store.state.sudoku)
    store.state.sudoku.cheated = true
  },

  /**
   * Determines whether to show the highlighted cells
   */
  progressOptions: {
    enable: () => {
      store.state.showProgress = true
    },
    disable: () => {
      store.state.showProgress = false
    },
  },

  /**
   * Start over with a fresh board
   */
  resetSudoku() {
    if (!store.state.sudoku.solvedTime) {
      store.state.previousSudoku = store.state.sudoku
    }
    const allCorrectFields = document.querySelectorAll('.field.correct')
    allCorrectFields.forEach(field => {
      if (!store.state.sudoku.solvedTime) field.classList.add("previousCorrect")
      field.classList.remove("correct")
    })
    const allWrongFields = document.querySelectorAll('.field.wrong')
    allWrongFields.forEach(field => {
      if (!store.state.sudoku.solvedTime) field.classList.add("previousWrong")
      field.classList.remove("wrong")
    })
    store.state.sudoku = generateSudoku()
  },

  /**
   * Restore your last board if you created a new one by mistake
   */
  restoreSudoku() {
    store.state.sudoku = store.state.previousSudoku
    store.state.previousSudoku = null
    const allCorrectFields = document.querySelectorAll('.field.correct')
    allCorrectFields.forEach(field => {
      field.classList.remove("correct")
    })
    const allWrongFields = document.querySelectorAll('.field.wrong')
    allWrongFields.forEach(field => {
      field.classList.remove("wrong")
    })
    const previousCorrectFields = document.querySelectorAll('.previousCorrect')
    previousCorrectFields.forEach(field => {
      field.classList.add("correct")
      field.classList.remove("previousCorrect")
    })
    const previousWrongFields = document.querySelectorAll('.previousWrong')
    previousWrongFields.forEach(field => {
      field.classList.add("wrong")
      field.classList.remove("previousWrong")
    })
  }
}
</script>

<template>
  <component :is="'style'" v-if="store.state.showProgress">
    .field.wrong:not([readonly]) {
    background-color: rgb(255 0 0 / 0.3);
    }

    .field.correct:not([readonly]) {
    background-color: rgba(0 255 0 / 0.3);
    }
  </component>
  <header class="header">
    <h1>Sudoku</h1>
  </header>
  <SudokuBoard :sudoku="store.state.sudoku" :onChange="store.handleChange" :solver="store.solveSudoku"
               :reset="store.resetSudoku" :progressOpts="store.progressOptions" :progress="store.state.showProgress"
               :restore="store.restoreSudoku" :previous="store.state.previousSudoku"/>
  <ReloadPrompt/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Shippori+Antique&display=swap');

html {
  --eerie-black: hsla(0, 0%, 8%, 1);
  --pewter-blue: hsla(190, 13%, 63%, 1);
  --white: hsla(0, 0%, 100%, 1);
  --amber-sae-ece: hsla(28, 100%, 53%, 1);
  --copper-rose: hsla(358, 20%, 51%, 1);
  --blue: hsla(220, 57%, 47%, 1);
  --step--3: clamp(0.6513rem, 0.5949rem + 0.2817vw, 0.7956rem);
  --step--2: clamp(0.7813rem, 0.7134rem + 0.339vw, 0.955rem);
  --step--1: clamp(0.9375rem, 0.8563rem + 0.4061vw, 1.1456rem);
  --step-0: clamp(1.125rem, 1.0762rem + 0.2439vw, 1.25rem);
  --step-1: clamp(1.35rem, 1.2329rem + 0.5854vw, 1.65rem);
  --step-2: clamp(1.62rem, 1.4795rem + 0.7024vw, 1.98rem);
  --step-3: clamp(1.9438rem, 1.775rem + 0.8439vw, 2.3763rem);
  --step-4: clamp(2.3325rem, 2.1301rem + 1.0122vw, 2.8513rem);
  --step-5: clamp(2.7994rem, 2.5567rem + 1.2134vw, 3.4213rem);
  --step-6: clamp(3.3594rem, 3.0682rem + 1.4561vw, 4.1056rem);
  --titles: 'Shippori Antique', sans-serif;

  --canvas: var(--white);
  --ink: var(--eerie-black);
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

html:focus-within {
  scroll-behavior: smooth;
}

* {
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--canvas);
  color: var(--ink);
  font: {
    family: system-ui, sans-serif;
    size: var(--step-0);
  }
  line-height: 1.5;
  min-block-size: 100vh;
  text-rendering: optimizeSpeed;
}

input,
button {
  font: inherit;
}

#app {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1, h2, h3 {
  font-family: var(--titles);
}

h1 {
  font-size: var(--step-5);
}

h2 {
  font-size: var(--step-1);
}

.header {
  background-color: var(--blue);
  display: grid;
  padding: 1em;
  place-items: center;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (prefers-color-scheme: dark) {
  html {
    --canvas: var(--eerie-black);
    --ink: var(--white);
  }
}
</style>
