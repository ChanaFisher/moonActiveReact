import { actions } from '../actions';
export const toUpperCaseFirstLetter = ({ dispatch, getState }) => next => action => {
    if (action.type === 'TO_UPPER_CASE_FIRST_LETTER') {
        if (action.payload.length == 1) {
            dispatch(actions.setName(action.payload.toUpperCase()));
        }
        else dispatch(actions.setName(action.payload));
    }
    return next(action);
}
