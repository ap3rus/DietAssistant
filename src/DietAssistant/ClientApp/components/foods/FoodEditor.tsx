import * as React from 'react';
import * as _ from 'lodash';
import { Food, Serving, Nutrient, NutrientType } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';

interface FoodEditorProps {
    food: Food;
    onChangeServings: (this: void, servings: Serving[]) => void;
    onCreateServing: (this: void, serving: Serving) => void;
    onChangeNutrients: (this: void, nutrients: Nutrient[]) => void;
    onCreateNutrient: (this: void, nutrient: Nutrient) => void;
    onSelectUnit: (this: void, unit: Serving) => void;
}

export default class FoodEditor extends React.Component<FoodEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
    }

    private handleChangeUnit(e) {
        const nextUnit = this.props.food.servings[e.target.selectedIndex];
        this.props.onSelectUnit(nextUnit);
    }

    public render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="foodName">Name</label>
                    <input type="text" className="form-control" id="foodName" placeholder="Name" value={this.props.food.name} />
                </div>
                <div className="form-group">
                    <label>Servings</label>
                    <ServingsGrid onChange={this.props.onChangeServings} servings={this.props.food.servings} onCreate={this.props.onCreateServing} />
                </div>
                <div className="form-group">
                    <label>Nutrients per</label>
                    <select className="form-control" value={this.props.food.unit && this.props.food.unit.grams} onChange={this.handleChangeUnit}>
                        {_.map(this.props.food.servings, (serving, index) => (
                            <option key={index} value={serving.grams}>{serving.name} &ndash; {serving.grams}g</option>
                        ))}
                    </select>
                    <NutrientsGrid onChange={this.props.onChangeNutrients} nutrients={this.props.food.nutrients} onCreate={this.props.onCreateNutrient} />
                </div>
            </div>
        );
    }
}