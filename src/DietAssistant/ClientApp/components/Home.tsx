import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient, IDayMealPlan, Time } from '../contracts';
import DayMealPlanEditor from './planning/DayMealPlanEditor';
import Page from './Page';

interface HomeState {
    mealPlan: IDayMealPlan;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeMealPlan = this.handleChangeMealPlan.bind(this);
        const mealPlan = { name: '', meals: [
            { name: 'Breakfast', time: new Time(8, 0), foods: [] },
            { name: 'Lunch', time: new Time(12, 0), foods: [] },
            { name: 'Dinner', time: new Time(18, 30), foods: [] }
        ] };
        this.state = { mealPlan };
    }

    handleChangeMealPlan(nextMealPlan: IDayMealPlan) {
        this.setState({ mealPlan: nextMealPlan });
    }

    public render() {

        return (
            <Page header="Diet assistant">
                :-)
            </Page>
        );
    }
}
