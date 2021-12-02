import 'css-doodle'
import '../reset.css'
import { star } from './effect'
import { doodle, proxy } from './doodle'

proxy.effect = star
setInterval(() => doodle.update(), 3000)
