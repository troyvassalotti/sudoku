<script setup>
import SudokuField from './SudokuField.vue'
import Timer from './Timer.vue'
import Result from './Result.vue'

defineProps({
  sudoku: Object,
  onChange: Function,
  solver: Function,
  reset: Function,
  progressOpts: Object,
  progress: Boolean,
  restore: Function,
  previous: Object,
})
</script>

<template>
  <main class="main">
    <Timer v-if="!sudoku.solvedTime" :start="sudoku.startTime"/>
    <Result v-if="sudoku.solvedTime" :sudoku="sudoku"/>
    <div class="wrapper">
      <div class="board" :class="{solved: sudoku.solvedTime}">
        <div class="row" v-for="row in sudoku.rows" :key="row.index">
          <SudokuField v-for="field in row.cols" :key="field.col" :field="field" :onChange="onChange"/>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="progress" @click="progressOpts.enable" v-if="!progress">Show Your Progress</button>
      <button class="progress" @click="progressOpts.disable" v-else>Hide Your Progress</button>
      <button class="solve" @click="solver">Solve it Magically!</button>
      <button class="reset" @click="reset">New Puzzle</button>
      <button class="restore" @click="restore" v-if="previous">Restore Your Last Board</button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  padding-block: 1rem;
  text-align: center;
}

.wrapper {
  margin-inline: auto;
  max-inline-size: 50rem;
  padding: 1rem;
}

.board {
  --thickness: 4px;
  border: var(--thickness) solid var(--ink);
}

.row {
  display: grid;
  grid-template-columns: repeat(9, minmax(10px, 1fr));

  &:nth-of-type(3) {
    border-block-end: var(--thickness) solid var(--ink);
  }

  &:nth-of-type(6) {
    border-block-end: var(--thickness) solid var(--ink);
  }
}

.buttons {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
  padding: 1rem;

  button {
    --lightness: 8%;
    --hs: 0deg, 0%;
    background-color: hsl(var(--hs), var(--lightness));
    border: none;
    border-radius: .5em;
    color: var(--canvas);
    cursor: pointer;
    font: {
      family: var(--titles);
      size: var(--step--1);
    }
    padding: {
      block: 1em;
      inline: 1em;
    }

    &:hover {
      --lightness: 28%;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .buttons button {
    --lightness: 95%;

    &:hover {
      --lightness: 60%;
    }
  }
}
</style>
