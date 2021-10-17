import { getVersion } from '@/common/js/util'

describe('utils', () => {
  it('renders props.msg when passed', async () => {
    const res = await getVersion()
    console.log(res)
  })
})
