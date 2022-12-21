export const getArray = <T>(array: T[]) => (Array.isArray(array) ? array : [])

export const getKeys = (obj: any) => {
  if (obj) {
    return Object.keys(obj)
  }
  return []
}

export const buildMap = <T extends { [k: string]: any }>(
  array: T[],
  key: keyof T,
) => array.reduce((acc, cur) => ({ ...acc, [cur[key]]: cur }), {})

export const dedup = <T>(array: T[], compare: (a: T, b: T) => boolean) =>
  array.reduce(
    (acc, item) => (acc.find((i) => compare(i, item)) ? acc : acc.concat(item)),
    [],
  )

export const splitArray = <T>(array: T[], interval = 4) => {
  const result: T[][] = []
  let temp: T[] = []
  for (const item of array) {
    temp.push(item)
    if (temp.length === interval) {
      result.push(temp)
      temp = []
    }
  }
  if (temp.length && interval > 0) {
    result.push(temp)
  }

  return result
}
