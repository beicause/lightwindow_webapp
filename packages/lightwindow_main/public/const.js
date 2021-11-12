const VERSION = '106'
const POLICY_VERSION = '1'

if (typeof require === 'function' && typeof module === 'object' && module && module.exports) {
  module.exports = { VERSION, POLICY_VERSION }
}

this.POLICY_VERSION = POLICY_VERSION
this.VERSION = VERSION
