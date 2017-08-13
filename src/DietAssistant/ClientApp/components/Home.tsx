import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient } from '../contracts';
import IngredientsGrid from './IngredientsGrid';
import RecipeEditor from './recipes/RecipeEditor';
import Page from './Page';

interface HomeState {
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
    }

    public render() {

        return (
            <Page header="Home">
                Here will be some dashboards and other cool things.
            </Page>
        );
    }
}
