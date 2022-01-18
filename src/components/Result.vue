<script setup>
import {onMounted, reactive} from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  sudoku: Object
})

const state = reactive({
  elapsed: 0,
  opponent: 0
})

function shareLink(e) {
  let link = props.sudoku.shareUrl
  if (navigator.share) {
    navigator.share({
      title: 'Sudoku',
      url: link
    })
  } else {
    navigator.clipboard.writeText(link)
    let el = e.target
    let initialText = el.innerText
    el.innerText = "👍 Link Copied 👍"
    setTimeout(() => {
      el.innerText = initialText
    }, 3000)
  }
}

onMounted(() => {
  state.elapsed = Math.floor((props.sudoku.solvedTime.getTime() - props.sudoku.startTime.getTime()) / 1000)

  state.opponent = props.sudoku.challengerSolvedTime ? Math.floor((props.sudoku.challengerSolvedTime.getTime() - props.sudoku.challengerStartTime.getTime()) / 1000) : null

  confetti()
})
</script>

<template>
  <div class="container">
    <h2 v-if="!props.sudoku.cheated">You solved it in {{ state.elapsed }} seconds</h2>
    <h2 v-else>You cheated, but it took you {{ state.elapsed }} seconds to do so.</h2>
    <p v-if="state.opponent">Your opponent solved it in {{ state.opponent }} seconds.</p>
    <div class="rickroll" v-if="props.sudoku.cheated">
      <p>⬇️ This is your punishment for cheating. ⬇️</p>
      <iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
    </div>
    <p>Challenge a friend: <button id="share" @click="shareLink">Share Puzzle Link</button></p>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin-block-end: .5em;
}

.rickroll iframe {
  aspect-ratio: 16 / 9;
  border: 0;
  display: block;
  inline-size: 100%;
  margin: {
    block: 1em;
    inline: auto;
  }
  max-inline-size: 800px;
}

#share {
  background-color: transparent;
  border: none;
  color: var(--blue);
  cursor: pointer;
  text-decoration: underline;
}
</style>