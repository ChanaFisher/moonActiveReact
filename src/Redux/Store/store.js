import { createStore, combineReducers, applyMiddleware } from 'redux';
import { toUpperCaseFirstLetter } from './MiddleWares/crud'
import tableReducer from './Reducers/Table';
const reducer = combineReducers( {tableReducer});
const store = createStore(reducer, applyMiddleware(toUpperCaseFirstLetter));
window.store = store;
export default store;
