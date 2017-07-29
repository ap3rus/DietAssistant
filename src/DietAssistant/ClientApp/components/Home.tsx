import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { Recipe, Food, IServing, INutrient, NutrientType, Ingredient } from '../contracts';
import FoodEditor from './foods/FoodEditor';
import IngredientsGrid from './IngredientsGrid';
import RecipeEditor from './recipes/RecipeEditor';

interface HomeState {
    food: Food;
    recipe: Recipe;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeRecipe = this.handleChangeRecipe.bind(this);
        this.handleChangeFood = this.handleChangeFood.bind(this);

        const food = new Food();
        const ingredients: Ingredient[] = [new Ingredient({ amount: 5, unit: food.unit, food: food })];
        const recipe = new Recipe({ ingredients });
        this.state = { food, recipe };
    }

    handleChangeFood(nextFood) {
        const nextIngredient = new Ingredient(this.state.recipe.ingredients[0]);
        nextIngredient.food = nextFood;
        this.setState({ food: nextFood, recipe: new Recipe({ ...this.state.recipe, ingredients: [nextIngredient]}) });
    }

    handleChangeRecipe(recipe: Recipe) {
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
