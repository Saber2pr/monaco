export function count(state = { value: 0 }, action) {
  switch (action.type) {
    case 'count/add':
      return { value: state.value + 1 }
    case 'count/sub':
      return { value: state.value - 1 }
    default:
      return state
  }
}
