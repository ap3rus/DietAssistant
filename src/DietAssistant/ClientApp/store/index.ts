import { FoodsState, foodsReducer } from '../components/foods/foodsReducer';
import { RecipesState, recipesReducer } from '../components/recipes/recipesReducer';
import { DayMealPlansState, dayMealPlansReducer } from '../components/planning/dayMealPlansReducer';

// The top-level state object
export interface ApplicationState {
    foods: FoodsState;
    recipes: RecipesState;
    dayMealPlans: DayMealPlansState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    foods: foodsReducer,
    recipes: recipesReducer,
    dayMealPlans: dayMealPlansReducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): any;
}
