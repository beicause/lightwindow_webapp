<template>
  <div style="position: absolute;display: flex;flex-direction: column;right: 8px;top: 8px">
    <v-btn @click="copy" small color="blue" outlined>复制</v-btn>
    <v-btn @click="paste" class="mt-2" small color="blue" outlined>粘贴</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Android } from '@/common/js/const'

export default Vue.extend({
  name: 'SettingClipboard',
  props: {
    copyValue: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy () {
      const text = document.createElement('textarea')
      text.value = this.copyValue
      document.body.appendChild(text)
      text.select()
      const isSuccess = document.execCommand('Copy')
      text.remove()
      this.$emit('copied', isSuccess && this.copyValue)
    },
    paste () {
      if (Android) {
        this.$emit('pasted', Android.getClipboardText())
      } else {
        navigator.clipboard.readText()
          .then(text => this.$emit('pasted', text))
          .catch(() => {
            // console.log(err)
            this.$emit('pasted', '')
          })
      }
    }
  }
})
</script>

<style scoped>

</style>
