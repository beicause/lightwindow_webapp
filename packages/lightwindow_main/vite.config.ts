import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import AutoComponent from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue2(),
    AutoComponent({
      resolvers: [VuetifyResolver()]
    }),
    ScriptSetup()
  ],
  resolve: {
    alias: [{
      find: '@', replacement: path.resolve(__dirname, 'src')
    }]
  }
})
