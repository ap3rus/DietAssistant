import * as _ from 'lodash';
import { IRecipe } from '../../contracts';
import { AppThunkAction } from '../../store';
import * as uuidv1 from 'uuid/v1';
import { IRepository, LocalStorageRepository } from '../../repository';

const repository: IRepository<IRecipe> = new LocalStorageRepository<IRecipe>("diet-assistant.recipes");

type SetRecipesType = 'recipes/set-recipes';
type SetSelectedRecipeType = 'recipes/set-selected-recipe';

export const SET_RECIPES: SetRecipesType = 'recipes/set-recipes';
export const SET_SELECTED_RECIPE: SetSelectedRecipeType = 'recipes/set-selected-recipe';

interface SetRecipesAction { type: SetRecipesType, recipes: IRecipe[] }
interface SetSelectedRecipeAction { type: SetSelectedRecipeType, recipe: IRecipe }

export type KnownAction = SetRecipesAction | SetSelectedRecipeAction;

export const actionCreators = {
    setRecipes: (recipes: IRecipe[]) => <SetRecipesAction>{ type: SET_RECIPES, recipes },
    setSelectedRecipe: (recipe: IRecipe) => <SetSelectedRecipeAction>{ type: SET_SELECTED_RECIPE, recipe },
    loadRecipesFromRepository: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const recipes = repository.getAll();
        dispatch(actionCreators.setRecipes(recipes));
    },
    upsertRecipe: (recipe: IRecipe): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextRecipe = { ...recipe };
        const nextRecipes = [...getState().recipes.recipes || []];
        if (nextRecipe.id) {
            const index = _.findIndex(nextRecipes, (f: IRecipe) => f.id == nextRecipe.id);
            nextRecipes[index] = nextRecipe;
        } else {
            nextRecipe.id = uuidv1();
            nextRecipes.push(nextRecipe);
        }

        dispatch(actionCreators.setRecipes(nextRecipes));
        dispatch(actionCreators.setSelectedRecipe(nextRecipe));
        repository.save(nextRecipe.id, nextRecipe);
    },
    removeRecipe: (recipe: IRecipe): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextRecipes = [...getState().recipes.recipes || []];
        const index = _.findIndex(nextRecipes, (f: IRecipe) => f.id == recipe.id);
        nextRecipes.splice(index, 1);
        dispatch(actionCreators.setRecipes(nextRecipes));
        dispatch(actionCreators.setSelectedRecipe(null));
        repository.remove(recipe.id);
    }
};