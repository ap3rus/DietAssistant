import { IFood } from '../../contracts';

type SetFoodsType = 'foods/set-foods';

export const SET_FOODS: SetFoodsType = 'foods/set-foods';

interface SetFoodsAction { type: SetFoodsType, foods: IFood[] }

export type KnownAction = SetFoodsAction;

export const actionCreators = {
    setFoods: (foods: IFood[]) => <SetFoodsAction>{ type: SET_FOODS, foods }
};