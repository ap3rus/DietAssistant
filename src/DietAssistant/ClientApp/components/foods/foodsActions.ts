import { Food } from '../../contracts';

type SetFoodsType = 'foods/set-foods';

export const SET_FOODS: SetFoodsType = 'foods/set-foods';

interface SetFoodsAction { type: SetFoodsType, foods: Food[] }

export type KnownAction = SetFoodsAction;

export const actionCreators = {
    setFoods: (foods: Food[]) => <SetFoodsAction>{ type: SET_FOODS, foods }
};