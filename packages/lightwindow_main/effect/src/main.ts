import 'css-doodle'
import { bubble } from './effect'
import { doodle, proxy } from './doodle'

proxy.effect = bubble
const timer = setInterval(() => doodle.update(), 3000)

// for android webview
window.effect = proxy.effect
window.bubble = bubble
window.timer = timer
