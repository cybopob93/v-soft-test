<script setup lang="ts">
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { vue } from '@codemirror/lang-vue'
import { Codemirror } from 'vue-codemirror'
import { ref, nextTick } from 'vue'
import TheCard from '@/components/TheCard.vue'

const extensionsForTemplate = [vue({ base: html() })]
const extensionsForCss = [css()]

const templateCode = ref(`
<article class="card-component">
    <img src="http://localhost:3000/example.png" />
    <label class="dynamic">some text</label>
    <p>some description</p>
    <p>{{ text }}</p>
  </article>
`)
const cssCode = ref(`
.card-component {
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  padding: 10px;
}
.card-component img {
  margin-bottom: 10px;
}
.card-component label {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 12pt;
}
.card-component p {
  margin: 0;
  font-size: 10pt;
}
`)
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
