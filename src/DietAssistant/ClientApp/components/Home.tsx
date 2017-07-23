import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { Food, Serving, Nutrient, NutrientType } from '../contracts';
import FoodEditor from './foods/FoodEditor';

interface HomeState {
    food: Food;
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();

        this.handleServingsChange = this.handleServingsChange.bind(this);
        this.handleCreateServing = this.handleCreateServing.bind(this);
        this.handleNutrientsChange = this.handleNutrientsChange.bind(this);
        this.handleCreateNutrient = this.handleCreateNutrient.bind(this);
        this.handleSelectUnit = this.handleSelectUnit.bind(this);

        const food = new Food();
        this.state = { food };
    }

    handleServingsChange(servings: Serving[]) {
        const nextFood = { ...this.state.food, servings } as Food;
        this.setState({ food: nextFood });
    }

    handleCreateServing(serving: Serving) {
        const nextFood = { ...this.state.food, servings: [...this.state.food.servings, serving] } as Food;
        this.setState({ food: nextFood });
    }

    handleNutrientsChange(nutrients: Nutrient[]) {
        const nextFood = { ...this.state.food, nutrients } as Food;
        this.setState({ food: nextFood });
    }

    handleCreateNutrient(nutrient: Nutrient) {
        const nextFood = { ...this.state.food, nutrients: [...this.state.food.nutrients, nutrient] } as Food;
        this.setState({ food: nextFood });
    }

    handleSelectUnit(unit: Serving) {
        const nextFood = { ...this.state.food, unit } as Food;
        this.setState({ food: nextFood });
    }

    public render() {

        return (
            <div>
                <FoodEditor
                    food={this.state.food}
                    onChangeServings={this.handleServingsChange}
                    onCreateServing={this.handleCreateServing}
                    onChangeNutrients={this.handleNutrientsChange}
                    onCreateNutrient={this.handleCreateNutrient}
                    onSelectUnit={this.handleSelectUnit}
                />
            </div>
        );
    }
}
