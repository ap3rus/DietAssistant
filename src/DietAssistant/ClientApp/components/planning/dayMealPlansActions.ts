import * as _ from 'lodash';
import { IDayMealPlan } from '../../contracts';
import { AppThunkAction } from '../../store';
import * as uuidv1 from 'uuid/v1';
import { IRepository, LocalStorageRepository } from '../../repository';

const repository: IRepository<IDayMealPlan> = new LocalStorageRepository<IDayMealPlan>("diet-assistant.meal-plans");

type SetDayMealPlansType = 'dayMealPlans/set-day-meal-plans';
type SetSelectedDayMealPlanType = 'dayMealPlans/set-selected-day-meal-plan';

export const SET_DAY_MEAL_PLANS: SetDayMealPlansType = 'dayMealPlans/set-day-meal-plans';
export const SET_SELECTED_DAY_MEAL_PLAN: SetSelectedDayMealPlanType = 'dayMealPlans/set-selected-day-meal-plan';

interface SetDayMealPlansAction { type: SetDayMealPlansType, dayMealPlans: IDayMealPlan[] }
interface SetSelectedDayMealPlanAction { type: SetSelectedDayMealPlanType, dayMealPlan: IDayMealPlan }

export type KnownAction = SetDayMealPlansAction | SetSelectedDayMealPlanAction;

export const actionCreators = {
    setDayMealPlans: (dayMealPlans: IDayMealPlan[]) => <SetDayMealPlansAction>{ type: SET_DAY_MEAL_PLANS, dayMealPlans },
    setSelectedDayMealPlan: (dayMealPlan: IDayMealPlan) => <SetSelectedDayMealPlanAction>{ type: SET_SELECTED_DAY_MEAL_PLAN, dayMealPlan },
    loadDayMealPlansFromRepository: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const dayMealPlans = repository.getAll();
        dispatch(actionCreators.setDayMealPlans(dayMealPlans));
    },
    upsertDayMealPlan: (dayMealPlan: IDayMealPlan): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextDayMealPlan = { ...dayMealPlan };
        const nextDayMealPlans = [...getState().dayMealPlans.dayMealPlans || []];
        if (nextDayMealPlan.id) {
            const index = _.findIndex(nextDayMealPlans, (f: IDayMealPlan) => f.id == nextDayMealPlan.id);
            nextDayMealPlans[index] = nextDayMealPlan;
        } else {
            nextDayMealPlan.id = uuidv1();
            nextDayMealPlans.push(nextDayMealPlan);
        }

        dispatch(actionCreators.setDayMealPlans(nextDayMealPlans));
        dispatch(actionCreators.setSelectedDayMealPlan(nextDayMealPlan));
        repository.save(nextDayMealPlan.id, nextDayMealPlan);
    },
    removeDayMealPlan: (dayMealPlan: IDayMealPlan): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const nextDayMealPlans = [...getState().dayMealPlans.dayMealPlans || []];
        const index = _.findIndex(nextDayMealPlans, (f: IDayMealPlan) => f.id == dayMealPlan.id);
        nextDayMealPlans.splice(index, 1);
        dispatch(actionCreators.setDayMealPlans(nextDayMealPlans));
        dispatch(actionCreators.setSelectedDayMealPlan(null));
        repository.remove(dayMealPlan.id);
    }
};