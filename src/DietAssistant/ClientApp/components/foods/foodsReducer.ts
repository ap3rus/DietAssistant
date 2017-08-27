import { Reducer, Action } from 'redux';
import { IFood } from '../../contracts';
import { KnownAction, SET_FOODS, SET_SELECTED_FOOD } from './foodsActions';

export interface FoodsState {
    foods: IFood[];
    selectedFood?: IFood;
}

const defaultState: FoodsState = {
    foods: [],
    selectedFood: null
};

export const foodsReducer: Reducer<FoodsState> = (state: FoodsState = defaultState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SET_FOODS:
            return { ...state, foods: action.foods };

        case SET_SELECTED_FOOD:
            return { ...state, selectedFood: action.food };

        default:
            return state;
    }
};
