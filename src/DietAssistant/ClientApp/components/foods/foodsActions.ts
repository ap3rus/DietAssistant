import * as _ from 'lodash';
import { IFood } from '../../contracts';
import { AppThunkAction } from '../../store';
import * as uuidv1 from 'uuid/v1';
import { IRepository, LocalStorageRepository } from '../../repository';

const repository: IRepository<IFood> = new LocalStorageRepository<IFood>("diet-assistant.foods");

type SetFoodsType = 'foods/set-foods';
type SetSelectedFoodType = 'foods/set-selected-food';

export const SET_FOODS: SetFoodsType = 'foods/set-foods';
export const SET_SELECTED_FOOD: SetSelectedFoodType = 'foods/set-selected-food';

interface SetFoodsAction { type: SetFoodsType, foods: IFood[] }
interface SetSelectedFoodAction { type: SetSelectedFoodType, food: IFood }

export type KnownAction = SetFoodsAction | SetSelectedFoodAction;

export const actionCreators = {
    setFoods: (foods: IFood[]) => <SetFoodsAction>{ type: SET_FOODS, foods },
    setSelectedFood: (food: IFood) => <SetSelectedFoodAction>{ type: SET_SELECTED_FOOD, food },
    loadFoodsFromRepository: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const foods = repository.getAll();
        dispatch(actionCreators.setFoods(foods));
    },
    upsertFood: (food: IFood): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextFood = { ...food };
        const nextFoods = [...getState().foods.foods || []];
        if (nextFood.id) {
            const index = _.findIndex(nextFoods, (f: IFood) => f.id == nextFood.id);
            nextFoods[index] = nextFood;
        } else {
            nextFood.id = uuidv1();
            nextFoods.push(nextFood);
        }

        dispatch(actionCreators.setFoods(nextFoods));
        dispatch(actionCreators.setSelectedFood(nextFood));
        repository.save(nextFood.id, nextFood);
        //repository.saveAll(_.map(nextFoods, (food) => ({ id: food.id, item: food })));
    },
    removeFood: (food: IFood): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextFoods = [...getState().foods.foods || []];
        const index = _.findIndex(nextFoods, (f: IFood) => f.id == food.id);
        nextFoods.splice(index, 1);
        dispatch(actionCreators.setFoods(nextFoods));
        dispatch(actionCreators.setSelectedFood(null));
        repository.remove(food.id);
    }
};