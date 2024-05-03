<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  h,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  reactive
} from 'vue'
//@ts-ignore
import { compile } from 'vue/dist/vue.esm-bundler.js'

const defaultTemplate = `
<article class="card-component">
    <img :src="componentData.image" />
    <label class="dynamic">{{ componentData.title }}</label>
    <p>{{ componentData.text }}</p>
  </article>
`

const defaultStyles = `
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
`

export default defineComponent({
  props: {
    templateString: String,
    cssString: String
  },
  emits: ['loaded'],
  setup(props, { emit }) {
    const componentStyles = ref(defaultStyles)
    const componentTemplate = ref(defaultTemplate)
    const load = ref(true)
    const componentData = reactive({ title: '', text: '', image: '' })

    const instance = getCurrentInstance()
    //@ts-ignore
    const componentId = `data-v-${instance?.type?.__hmrId || +new Date()}`

    const templateData = computed(() => props.templateString || componentTemplate.value)

    const stylesData = computed(
      () => `
      div[${componentId}] {
        ${props.cssString || componentStyles.value}
      }
    `
    )

    onBeforeMount(() => {
      fetchComponentData()
    })

    onBeforeUnmount(() => {
      document.getElementById(componentId)?.remove()
    })

    function updateCss() {
      const element = document.getElementById(componentId)
      if (element) {
        element.innerHTML = stylesData.value
        return
      }
      const css = document.createElement('style')
      css.setAttribute('type', 'text/css')
      css.setAttribute('id', componentId)
      css.appendChild(document.createTextNode(stylesData.value))
      document.head.append(css)
    }

    async function fetchComponentData() {
      try {
        const data = await fetch('http://localhost:3000/components/TheCard')
        if (data.ok) {
          const { template, style } = await data.json()
          componentTemplate.value = template
          componentStyles.value = style
        }
        const { title, text, image } = await fetch('http://localhost:3000/cards').then((res) =>
          res.json()
        )
        componentData.title = title ?? ''
        componentData.text = text ?? ''
        componentData.image = image ?? ''
      } finally {
        updateCss()
        emit('loaded', componentTemplate.value, componentStyles.value)
        load.value = false
      }
    }

    watch(stylesData, () => {
      updateCss()
    })

    return () => {
      compile(templateData.value)
      const attrs = { [componentId]: '' }

      return h('div', attrs, [
        load.value
          ? h('div', { class: 'placeholder' }, [h('div', { class: 'animated-background' })])
          : h({
              template: templateData.value,
              attrs,
              setup() {
                return {
                  componentData
                }
              }
            })
      ])
    }
  }
})
</script>
<template></template>
<style scoped>
.placeholder {
  margin: 0 auto;
  min-width: 300px;
  min-height: 200px;
  background-color: #eee;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animated-background {
  animation-duration: 1.25s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: darkgray;
  background: linear-gradient(to right, #eeeeee 10%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
  min-height: 200px;
  position: relative;
}
</style>
