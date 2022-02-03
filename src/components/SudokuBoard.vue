<script setup>
import SudokuField from './SudokuField.vue'
import Timer from './Timer.vue'
import Result from './Result.vue'
import {reactive} from "vue"

const props = defineProps({
  sudoku: Object,
  onChange: Function,
  solver: Function,
  reset: Function,
  progress: Boolean,
  progressOpts: Object,
  restore: Function,
  previous: Object,
})

const toggle = reactive({checked: false})

function handleToggle(e) {
  console.log(e.target.value)
  if (toggle.checked) {
    props.progressOpts.enable()
  } else {
    props.progressOpts.disable()
  }
}
</script>

<template>
  <main class="main">
    <Timer v-if="!props.sudoku.solvedTime" :start="props.sudoku.startTime"/>
    <Result v-if="props.sudoku.solvedTime" :sudoku="props.sudoku"/>
    <div class="wrapper">
      <div class="board" :class="{solved: props.sudoku.solvedTime}">
        <div class="row" v-for="row in props.sudoku.rows" :key="row.index">
          <SudokuField v-for="field in row.cols" :key="field.col" :field="field" :onChange="props.onChange"/>
        </div>
      </div>
    </div>
    <div class="buttons">
      <label class="switch" for="progress-toggle">
        <input type="checkbox" name="Toggle Cell Highlighting" id="progress-toggle" v-model="toggle.checked"
               @change="handleToggle">
        <div class="slider"></div>
      </label>
      <button class="solve" @click="props.solver">Solve it Magically!</button>
      <button class="reset" @click="props.reset">New Puzzle</button>
      <button class="restore" @click="props.restore" v-if="props.previous">Restore Your Last Board</button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  padding-block: 1rem;
}

.wrapper {
  margin-inline: auto;
  max-inline-size: 45rem;
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

.switch {
  --h: calc(var(--w) / 2);
  --w: 3.5rem;
  block-size: var(--h);
  display: inline-block;
  inline-size: var(--w);

  input {
    display: none;

    &:checked {
      + .slider {
      --bg: var(--blue);

        &::before {
          transform: translateX(var(--h));
        }
      }
    }
  }

  .slider {
    --bg: var(--amber-sae-ece);
    background-color: var(--bg);
    block-size: inherit;
    border-radius: 34px;
    cursor: pointer;
    inline-size: inherit;
    position: absolute;
    transition: background-color .5s linear;

    &::before {
      background-color: var(--ink);
      block-size: var(--h);
      border-radius: 50%;
      content: "";
      inline-size: var(--h);
      position: absolute;
      transition: 0.4s, background-color 1s linear;
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
