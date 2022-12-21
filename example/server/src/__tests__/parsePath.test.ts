import { parsePath } from '../'

describe('ParsePath', () => {
  it('test parse', () => {
    expect(parsePath('/path/file')).toMatchSnapshot()
  })
})
