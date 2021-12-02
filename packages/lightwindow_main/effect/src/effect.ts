import { icons } from './svg'

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


export const star =  `
  mask-image: @svg(${icons.star});
  @grid: 9,11 / 100%,100%;
  visibility: hidden;
  @random(@r(0,.5)){
    visibility:visible;
    transform:scale(@r(0,1)) translate(@r(-24,24)px,@r(-24,24)px);
    animation-name: fade,flash;
    animation-duration: @r(1,2)s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay:@r(0,1)s   
  }
`+ fade + flash
