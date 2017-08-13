import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient, IDayMealPlan } from '../contracts';
import MealPlanEditor from './planning/MealPlanEditor';
import Page from './Page';

interface HomeState {
    mealPlan: IDayMealPlan;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeMealPlan = this.handleChangeMealPlan.bind(this);
        const mealPlan = { name: '', meals: [] };
        this.state = { mealPlan };
    }

    handleChangeMealPlan(nextMealPlan: IDayMealPlan) {
        this.setState({ mealPlan: nextMealPlan });
    }

    public render() {

        return (
            <Page header="Home - testing MealPlanEditor">
                <MealPlanEditor mealPlan={this.state.mealPlan} onChangeMealPlan={this.handleChangeMealPlan} />
            </Page>
        );
    }
}
