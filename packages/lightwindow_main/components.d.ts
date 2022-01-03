
declare module 'vue/types' {
  type ui = typeof import('vuetify/lib')
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface GlobalComponents extends ui { }
}

export { }
