import produce from 'immer';
import createReducer from './ReducerUtil';
const initialState = {
   dataTable:[]
}
const table = {
    setDataTable(state,action){
      state.dataTable=action.payload;
    }
}
export default produce((state, action) => createReducer(state, action, table), initialState);