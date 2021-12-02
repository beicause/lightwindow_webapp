import { DoodleElement } from '../window'

export const doodle = document.querySelector('css-doodle') as DoodleElement

const _target = {
  effect: ''
}

export const proxy = new Proxy(_target, {
  set (target, prop, value, receiver) {
    const r = Reflect.set(target, prop, value, receiver)
    updateDoodle()
    return r
  }
})

function updateDoodle () {
  doodle.update(`
        :doodle{
          grid-gap: 0;
        }
        background-repeat:no-repeat;
        background-position:center;
        mask-repeat:no-repeat;
        mask-position:center;
        ${_target.effect}
    `)
}
