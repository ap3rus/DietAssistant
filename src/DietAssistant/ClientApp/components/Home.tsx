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
    recipe: IRecipe;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeRecipe = this.handleChangeRecipe.bind(this);

        const recipe: IRecipe = { name: '', notes: '', ingredients: [], unit: null, servings: [] };
        this.state = { recipe };
    }

    handleChangeRecipe(recipe: IRecipe) {
        this.setState({ recipe });
    }

    public render() {

        return (
            <Page header="Home">
                <RecipeEditor recipe={this.state.recipe} onChange={this.handleChangeRecipe} />
            </Page>
        );
    }
}
