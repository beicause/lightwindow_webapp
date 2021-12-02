import { KeyFrame } from './utils'

export const fade =
`
  @keyframes fade {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% {opacity: 0 }
  }
`

export const flash =
`
  @keyframes flash {
    0% { background-color: transparent }
    25% { background-color: #cd1818 }
    50% { background-color: #fff323 }
    75% { background-color: #cd1818 }
    100% { background-color: transparent }
  }
`

export const zoom =
`
  @keyframes zoom {
    0% { transform: scale(0) }
    50% { transform: scale(1) }
    100% { transform: scale(0) }
  }
`

export const bubble = `
  mask-image: @svg(<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/></svg>);
  mask-size: 20px;
  @grid: 9,11 / 100%,100%;
  background-color: #ffffff;
  opacity:0;
  @random(@r(0,.6)){
    animation-name: bubble;
    animation-duration: @r(1,2)s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay:@r(0,1)s;
    transform-origin: right bottom; 
  }
` + new KeyFrame(fade).add(flash).add(zoom).toString('bubble') // css-doodle generates so much keyframes styles ,so I merge it manually
