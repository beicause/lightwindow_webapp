const VERSION = '103'
const INDEX_URL = 'https://qingcheng.asia'
const POLICY_VERSION = '1'

if (typeof require === 'function' && typeof module === 'object' && module && module.exports) {
  module.exports = { VERSION, INDEX_URL, POLICY_VERSION }
} else {
  this.INDEX_URL = INDEX_URL
  this.POLICY_VERSION = POLICY_VERSION
  this.VERSION = VERSION
}
