import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { Food, Serving, Nutrient, NutrientType, Ingredient } from '../contracts';
import FoodEditor from './foods/FoodEditor';
import IngredientsGrid from './IngredientsGrid';

interface HomeState {
    food: Food;
    ingredients: Ingredient[]
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeFood = this.handleChangeFood.bind(this);

        const food = new Food();
        const ingredients: Ingredient[] = [new Ingredient({ amount: 5, unit: food.unit, food: food })];
        this.state = { food, ingredients };
    }

    handleChangeFood(nextFood) {
        const nextIngredient = new Ingredient(this.state.ingredients[0]);
        nextIngredient.food = nextFood;
        this.setState({ food: nextFood, ingredients: [nextIngredient] });
    }

    handleChangeIngredients(ingredients: Ingredient[]) {
        this.setState({ ingredients });
    }

    public render() {

        return (
            <div>
                <FoodEditor food={this.state.food} onChangeFood={this.handleChangeFood} />

                <IngredientsGrid ingredients={this.state.ingredients} onChange={this.handleChangeIngredients} />
            </div>
        );
    }
}
