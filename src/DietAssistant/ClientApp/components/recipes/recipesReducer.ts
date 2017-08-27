import { Reducer, Action } from 'redux';
import { IRecipe } from '../../contracts';
import { KnownAction, SET_RECIPES, SET_SELECTED_RECIPE } from './recipesActions';

export interface RecipesState {
    recipes: IRecipe[];
    selectedRecipe?: IRecipe;
}

const defaultState: RecipesState = {
    recipes: [],
    selectedRecipe: null
};

export const recipesReducer: Reducer<RecipesState> = (state: RecipesState = defaultState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SET_RECIPES:
            return { ...state, recipes: action.recipes };

        case SET_SELECTED_RECIPE:
            return { ...state, selectedRecipe: action.recipe };

        default:
            return state;
    }
};
