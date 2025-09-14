import { CHANGE_LIST } from "./constants";

const defaultState = {
  name: 'sanyuan',
  list: []
}

export default (state = defaultState, action: any) => {
  switch(action.type) {
    case CHANGE_LIST:
      return {
        ...state,
        list: action.list
      }
    default:
      return state;
  }
}
