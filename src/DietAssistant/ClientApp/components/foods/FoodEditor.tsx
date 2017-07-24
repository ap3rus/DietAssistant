import * as React from 'react';
import * as _ from 'lodash';
import { Food, Serving, Nutrient, NutrientType } from '../../contracts';
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
        this.handleCreateServing = this.handleCreateServing.bind(this);
        this.handleChangeNutrients = this.handleChangeNutrients.bind(this);
        this.handleCreateNutrient = this.handleCreateNutrient.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleChangeUnit(e) {
        const nextUnit = this.props.food.servings[e.target.selectedIndex];
        const nextFood = new Food({ ...this.props.food, unit: nextUnit });
        this.props.onChangeFood(nextFood);
    }

    handleChangeServings(servings: Serving[]) {
        const nextFood = new Food({ ...this.props.food, servings });
        this.props.onChangeFood(nextFood);
    }

    handleCreateServing(serving: Serving) {
        const nextFood = new Food({ ...this.props.food, servings: [...this.props.food.servings, serving] });
        if (!nextFood.unit) {
            nextFood.unit = serving;
        }
        this.props.onChangeFood(nextFood);
    }

    handleChangeNutrients(nutrients: Nutrient[]) {
        const nextFood = new Food({ ...this.props.food, nutrients });
        this.props.onChangeFood(nextFood);
    }

    handleCreateNutrient(nutrient: Nutrient) {
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
                    <ServingsGrid onChange={this.handleChangeServings} servings={this.props.food.servings} onCreate={this.handleCreateServing} />
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