
export class KeyFrame {
    name = ''
    keyframes = new Map<string, string[]>()
    constructor (keyframes?:string) {
      keyframes && this.from(keyframes)
    }

    from (keyframes:string):KeyFrame {
      this.name = keyframes.match(/@keyframes\s*(\S+)\s*{/)![1]
      const s = keyframes.replace(/@keyframes.*?{/, '').replace(/}$/, '')
      const frames = s.split('}')
      frames.forEach(val => {
        if (/\S/.test(val)) { this.keyframes.set(val.match(/\S+/)![0], [val.match(/{(.*)/)![1]]) }
      })
      return this
    }

    add (keyframes:string):KeyFrame {
      const s = keyframes.replace(/.*?{/, '').replace(/}$/, '')
      const frames = s.split('}')
      frames.forEach(val => {
        if (/\S/.test(val)) {
          const key = val.match(/\S+/)![0]
          const prop = val.match(/{(.*)/)![1]
          // eslint-disable-next-line no-unused-expressions
          if (this.keyframes.has(key)) this.keyframes.get(key)?.push(prop)
          else this.keyframes.set(key, [prop])
        }
      })
      return this
    }

    toString (name:string = this.name):string {
      if (!name) throw new Error('please define keyframes name')
      let s = `@keyframes ${name} {\n`
      this.keyframes.forEach((val, key) => {
        s += `${key}{${val.join(';')}}`
      })
      s += '}'
      return s
    }
}
