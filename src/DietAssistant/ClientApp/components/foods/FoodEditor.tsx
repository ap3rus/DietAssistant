import * as React from 'react';
import * as _ from 'lodash';
import { IFood, IServing, INutrient, NutrientType, defaultNutritionUnit, changeServing, compareServings, getServingNameWithGrams, getFoodServings } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import { dropdown } from '../EasyGrid';

interface FoodEditorState {
    nutritionUnit?: IServing;
}

interface FoodEditorProps {
    food: IFood;
    onChangeFood: (this: void, food: IFood) => void;
}

export default class FoodEditor extends React.Component<FoodEditorProps, FoodEditorState> {
    constructor() {
        super();

        this.state = { nutritionUnit: defaultNutritionUnit };
        this.handleSelectNutritionUnit = this.handleSelectNutritionUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeNutrients = this.handleChangeNutrients.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleSelectNutritionUnit(unit: IServing, selectedIndex: number) {
        this.setState({ nutritionUnit: unit });
    }

    private handleChangeServings(servings: IServing[]) {
        const nextFood = { ...this.props.food, servings };
        this.props.onChangeFood(nextFood);
    }

    private handleChangeNutrients(nutrients: INutrient[]) {
        const nextNutrients = this.state.nutritionUnit ?
            _.map(nutrients, (nutrient) => changeServing(nutrient, this.state.nutritionUnit, defaultNutritionUnit)) :
            nutrients;
        const nextFood = { ...this.props.food, nutrients: nextNutrients };
        this.props.onChangeFood(nextFood);
    }

    private handleChangeName(e) {
        const nextFood = { ...this.props.food, name: e.target.value };
        this.props.onChangeFood(nextFood);
    }

    private getNutrients() {
        return this.state.nutritionUnit ?
            _.map(this.props.food.nutrients, (nutrient) => changeServing(nutrient, defaultNutritionUnit, this.state.nutritionUnit)) :
            this.props.food.nutrients;
    }

    private getServings() {
        return getFoodServings(this.props.food);
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
                    <ServingsGrid onChange={this.handleChangeServings} servings={this.props.food.servings} allowEmpty />
                </div>
                <div className="form-group">
                    <label>Nutrients per</label>
                    <div>
                        {dropdown(
                            this.state.nutritionUnit,
                            _.map(this.getServings(), (serving, index) => ({ content: getServingNameWithGrams(serving), value: serving })),
                            this.handleSelectNutritionUnit,
                            '(select serving)',
                            compareServings
                        )}
                    </div>
                    <NutrientsGrid onChange={this.handleChangeNutrients} nutrients={this.getNutrients()} />
                </div>
            </form>
        );
    }
}