/* eslint-disable @typescript-eslint/no-var-requires */
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path')
/* eslint-enable @typescript-eslint/no-var-requires */

const devPlugins = process.env.NODE_ENV === 'production' ? [
  new PrerenderSPAPlugin({
    staticDir: path.join(__dirname, 'dist'),
    routes: ['/', '/main/feature', '/main/guide', '/main/about', '/policy', '/music'],
    renderer: new Renderer({
      renderAfterDocumentEvent: 'render-event'
    })
  })
  // new CompressionWebpackPlugin({
  //   test: /\.js$|\.css$|\.html$/, // 对匹配的文件类型进行压缩
  // })
] : []
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: '/',
  configureWebpack: {
    plugins: [...devPlugins]
  }
}
