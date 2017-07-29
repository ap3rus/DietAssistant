﻿import * as React from 'react';
import * as _ from 'lodash';
import { Food, IServing, INutrient, NutrientType } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';

interface FoodEditorProps {
    food: Food;
    onChangeFood: (this: void, food: Food) => void;
}

export default class FoodEditor extends React.Component<FoodEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeNutrients = this.handleChangeNutrients.bind(this);
        this.handleCreateNutrient = this.handleCreateNutrient.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleChangeUnit(e) {
        const nextUnit = this.props.food.servings[e.target.selectedIndex];
        const nextFood = new Food({ ...this.props.food, unit: nextUnit });
        this.props.onChangeFood(nextFood);
    }

    handleChangeServings(servings: IServing[]) {
        const nextFood = new Food({ ...this.props.food, servings });
        if (!nextFood.unit && servings.length > 0) {
            nextFood.unit = servings[0];
        }
        this.props.onChangeFood(nextFood);
    }

    handleChangeNutrients(nutrients: INutrient[]) {
        const nextFood = new Food({ ...this.props.food, nutrients });
        this.props.onChangeFood(nextFood);
    }

    handleCreateNutrient(nutrient: INutrient) {
        const nextFood = new Food({ ...this.props.food, nutrients: [...this.props.food.nutrients, nutrient] });
        this.props.onChangeFood(nextFood);
    }

    handleChangeName(e) {
        const nextFood = new Food({ ...this.props.food, name: e.target.value });
        this.props.onChangeFood(nextFood);
    }

    public render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="foodName">Name</label>
                    <input type="text" className="form-control" id="foodName" placeholder="Name" value={this.props.food.name} onChange={this.handleChangeName} />
                </div>
                <div className="form-group">
                    <label>Servings</label>
                    <ServingsGrid onChange={this.handleChangeServings} servings={this.props.food.servings} />
                </div>
                <div className="form-group">
                    <label>Nutrients per</label>
                    <select className="form-control" value={this.props.food.unit && this.props.food.unit.grams} onChange={this.handleChangeUnit}>
                        {_.map(this.props.food.servings, (serving, index) => (
                            <option key={index} value={serving.grams}>{serving.name} &ndash; {serving.grams}g</option>
                        ))}
                    </select>
                    <NutrientsGrid onChange={this.handleChangeNutrients} nutrients={this.props.food.nutrients} onCreate={this.handleCreateNutrient} />
                </div>
            </div>
        );
    }
}