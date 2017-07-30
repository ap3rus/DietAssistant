import { Reducer } from 'redux';
import { IFood } from '../../contracts';
import { KnownAction, SET_FOODS } from './foodsActions';

export interface FoodsState {
    foods: IFood[]
}

const defaultState: FoodsState = {
    foods: []
};

export const foodsReducer: Reducer<FoodsState> = (state: FoodsState = defaultState, action: KnownAction) => {
    switch (action.type) {
        case SET_FOODS:
            const nextState = { foods: action.foods };
            return nextState;
        default:
            return state;
    }
};
