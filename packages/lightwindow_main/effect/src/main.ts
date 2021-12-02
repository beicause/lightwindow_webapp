import 'css-doodle'
import '../reset.css'
import { bubble } from './effect'
import { doodle, proxy } from './doodle'

proxy.effect = bubble
setInterval(() => doodle.update(), 3000)
