<script setup lang="ts">
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { vue } from '@codemirror/lang-vue'
import { Codemirror } from 'vue-codemirror'
import { ref } from 'vue'
import TheCard from '@/components/TheCard.vue'

const extensionsForTemplate = [vue({ base: html() })]
const extensionsForCss = [css()]

const templateCode = ref('')
const cssCode = ref('')
const cssForComponent = ref(``)
const templateForComponent = ref(``)

function saveComponentData() {
  fetch('http://localhost:3000/components/TheCard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template: templateCode.value,
      style: cssCode.value
    })
  })
}

function updateTemplate() {
  templateForComponent.value = templateCode.value
}
function updateCss() {
  cssForComponent.value = cssCode.value
}

function setStartData(template: string, styles: string) {
  templateCode.value = template
  cssCode.value = styles
}
</script>

<template>
  <main>
    <section>
      <div>
        <h2>Template:</h2>
        <codemirror
          v-model="templateCode"
          placeholder="Code goes here..."
          :style="{ height: '400px', minWidth: '460px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensionsForTemplate"
          @blur="updateTemplate"
        />
      </div>
      <div>
        <h2>CSS:</h2>
        <codemirror
          v-model="cssCode"
          placeholder="Code goes here..."
          :style="{ height: '400px', minWidth: '460px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensionsForCss"
          @blur="updateCss"
        />
      </div>
    </section>
    <section>
      <the-card
        :css-string="cssForComponent"
        :template-string="templateForComponent"
        @loaded="setStartData"
      />
      <button @click="saveComponentData">Save</button>
    </section>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

main section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main section button {
  margin-top: 40px;
}
</style>
