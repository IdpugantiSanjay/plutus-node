import mergeNoOverlap from '../src/internal/mergeNoOverlap'

describe('mergeNoOverlap function', () => {
  it('Should merge object if no duplicates / overlaps exist', () => {
    const option = mergeNoOverlap({ name: 'Sanjay' }, { age: 24 }, { location: 'Eluru' })
    assertTrue(option._tag == 'Some')
    expect(Object.keys(option.value).length).toBe(3)
  })

  it('Should return None if duplicate keys exist', () => {
    const option = mergeNoOverlap({ name: 'Sanjay' }, { name: 24 }, { location: 'Eluru' })
    expect(option._tag).toBe('None')
  })

  it('Should return None even if duplicate keys exist case insensitive', () => {
    const option = mergeNoOverlap({ name: 'Sanjay' }, { NaMe: 24 }, { location: 'Eluru' })
    expect(option._tag).toBe('None')
  })
})
