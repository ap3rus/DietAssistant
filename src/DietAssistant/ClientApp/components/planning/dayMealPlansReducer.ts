import { Reducer, Action } from 'redux';
import { IDayMealPlan } from '../../contracts';
import { KnownAction, SET_DAY_MEAL_PLANS, SET_SELECTED_DAY_MEAL_PLAN } from './dayMealPlansActions';

export interface DayMealPlansState {
    dayMealPlans: IDayMealPlan[];
    selectedDayMealPlan?: IDayMealPlan;
}

const defaultState: DayMealPlansState = {
    dayMealPlans: [],
    selectedDayMealPlan: null
};

export const dayMealPlansReducer: Reducer<DayMealPlansState> = (state: DayMealPlansState = defaultState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SET_DAY_MEAL_PLANS:
            return { ...state, dayMealPlans: action.dayMealPlans };

        case SET_SELECTED_DAY_MEAL_PLAN:
            return { ...state, selectedDayMealPlan: action.dayMealPlan };

        default:
            return state;
    }
};
