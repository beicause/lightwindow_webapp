import { KeyFrame } from '../src/utils'

test('KeyFrame construction and from should work', () => {
  const keyframes = `
    @keyframes flash {
        0% { background-color: transparent }
        25% { background-color: #cd1818 }
        50% { background-color: #fff323 }
        75% { background-color: #cd1818 }
        100% { background-color: transparent }
      }`
  const k1 = new KeyFrame(keyframes)
  const k2 = new KeyFrame().from(keyframes)
  expect('' + k1).toBe('' + k2)
  expect('' + k1).toBe('@keyframes flash{0%{ background-color: transparent }25%{ background-color: #cd1818 }50%{ background-color: #fff323 }75%{ background-color: #cd1818 }100%{ background-color: transparent }}')
})

test('KeyFrame add should work', () => {
  const k = new KeyFrame()
  k.from(`
  @keyframes flash {
      0% { background-color: transparent }
      25% { background-color: #cd1818 }
      50% { background-color: #fff323 }
      75% { background-color: #cd1818 }
      100% { background-color: transparent }
    }`)
  k.add(`
    {
        0% { background-color: red }
        50% { background-color: red }
        100% { background-color: red }
      }`)
  expect('' + k).toBe('@keyframes flash{0%{ background-color: transparent ; background-color: red }25%{ background-color: #cd1818 }50%{ background-color: #fff323 ; background-color: red }75%{ background-color: #cd1818 }100%{ background-color: transparent ; background-color: red }}')
})
