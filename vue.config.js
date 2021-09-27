const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require("path")
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: '/',
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/main/feature', '/main/guide', '/main/about', '/policy', '/music'],
        renderer: new Renderer({
          renderAfterDocumentEvent: 'render-event'
        })
      })
    ]
  }
}

