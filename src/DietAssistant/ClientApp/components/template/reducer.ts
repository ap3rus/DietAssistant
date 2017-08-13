import { Reducer } from 'redux';
import { KnownAction, FOO } from './actions';

export interface State {
    bar?: string;
}

const defaultState: State = {
    bar: null
};

export const foodsReducer: Reducer<State> = (state: State = defaultState, action: KnownAction) => {
    switch (action.type) {
        case FOO:
            return { ...state, bar: action.bar };

        default:
            return state;
    }
};
