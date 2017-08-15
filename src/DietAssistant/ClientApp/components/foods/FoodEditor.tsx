import * as React from 'react';
import * as _ from 'lodash';
import { IFood, IServing, INutrient, NutrientType } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import { dropdown } from '../EasyGrid';

interface FoodEditorProps {
    food: IFood;
    onChangeFood: (this: void, food: IFood) => void;
}

export default class FoodEditor extends React.Component<FoodEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeNutrients = this.handleChangeNutrients.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleChangeUnit(grams, selectedIndex) {
        const nextUnit = this.props.food.servings[selectedIndex];
        const nextFood = { ...this.props.food, unit: nextUnit };
        this.props.onChangeFood(nextFood);
    }

    handleChangeServings(servings: IServing[]) {
        const nextFood = { ...this.props.food, servings };
        if (!nextFood.unit && servings.length > 0) {
            nextFood.unit = servings[0];
        }
        this.props.onChangeFood(nextFood);
    }

    handleChangeNutrients(nutrients: INutrient[]) {
        const nextFood = { ...this.props.food, nutrients };
        this.props.onChangeFood(nextFood);
    }

    handleChangeName(e) {
        const nextFood = { ...this.props.food, name: e.target.value };
        this.props.onChangeFood(nextFood);
    }

    public render() {
        return (
            <form>
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
                    <div>
                        {dropdown(
                            _.get(this.props.food.unit, 'grams'),
                            _.map(this.props.food.servings, (serving, index) => ({ content: `${serving.name} - ${serving.grams}g`, value: serving.grams })),
                            this.handleChangeUnit,
                            '(select serving)'
                        )}
                    </div>
                    <NutrientsGrid onChange={this.handleChangeNutrients} nutrients={this.props.food.nutrients} />
                </div>
            </form>
        );
    }
}