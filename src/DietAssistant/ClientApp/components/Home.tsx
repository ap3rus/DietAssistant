import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient } from '../contracts';
import FoodEditor from './foods/FoodEditor';
import IngredientsGrid from './IngredientsGrid';
import RecipeEditor from './recipes/RecipeEditor';

interface HomeState {
    food: IFood;
    recipe: IRecipe;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeRecipe = this.handleChangeRecipe.bind(this);
        this.handleChangeFood = this.handleChangeFood.bind(this);

        const food = { name: '', unit: null, servings: [], nutrients: [] };
        const ingredients: IIngredient[] = [{ amount: 5, unit: food.unit, food: food }];
        const recipe: IRecipe = { name: '', notes: '', ingredients, unit: null, servings: [] };
        this.state = { food, recipe };
    }

    handleChangeFood(nextFood) {
        const nextIngredient = { ...this.state.recipe.ingredients[0], food: nextFood };
        if (!nextIngredient.unit || !_.some(nextFood.servings, (serving: IServing) => serving.grams === nextIngredient.unit.grams)) {
            nextIngredient.unit = nextFood.unit;
        }
        this.setState({ food: nextFood, recipe: { ...this.state.recipe, ingredients: [nextIngredient]} });
    }

    handleChangeRecipe(recipe: IRecipe) {
        this.setState({ recipe });
    }

    public render() {

        return (
            <div>
                <FoodEditor food={this.state.food} onChangeFood={this.handleChangeFood} />
                <hr />
                <RecipeEditor recipe={this.state.recipe} onChange={this.handleChangeRecipe} />
            </div>
        );
    }
}
