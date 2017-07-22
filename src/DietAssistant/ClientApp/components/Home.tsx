import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import NutrientsGrid from './NutrientsGrid';
import { Serving, Nutrient, NutrientType } from '../contracts';

interface HomeState {
    servings: Serving[];
    nutrients: Nutrient[];
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();

        this.handleServingsChange = this.handleServingsChange.bind(this);
        this.handleCreateServing = this.handleCreateServing.bind(this);
        this.handleNutrientsChange = this.handleNutrientsChange.bind(this);
        this.handleCreateNutrient = this.handleCreateNutrient.bind(this);

        const servings = [];
        const nutrients = [];
        this.state = { servings, nutrients };
    }

    handleServingsChange(servings: Serving[]) {
        this.setState({ servings });
    }

    handleCreateServing(serving: Serving) {
        this.setState({ servings: [...this.state.servings, serving] });
    }

    handleNutrientsChange(nutrients: Nutrient[]) {
        this.setState({ nutrients });
    }

    handleCreateNutrient(nutrient) {
        this.setState({ nutrients: [...this.state.nutrients, nutrient] });
    }

    public render() {

        return (
            <div>
                <ServingsGrid onChange={this.handleServingsChange} servings={this.state.servings} onCreate={this.handleCreateServing} />
                <hr />
                <NutrientsGrid onChange={this.handleNutrientsChange} nutrients={this.state.nutrients} onCreate={this.handleCreateNutrient} />
            </div>
        );
    }
}
