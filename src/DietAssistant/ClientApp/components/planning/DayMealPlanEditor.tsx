import * as React from 'react';
import * as _ from 'lodash';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import { IDayMealPlan, IMeal, IIngredient, Time, getMealPlanNutrition } from '../../contracts';
import { dropdown } from '../EasyGrid';
import IngredientsGrid from '../IngredientsGrid';

interface MealPlanEditorProps {
    dayMealPlan: IDayMealPlan;
    onChangeDayMealPlan: (this: void, mealPlan: IDayMealPlan) => void;
}

export default class MealPlanEditor extends React.Component<MealPlanEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeMealName = this.handleChangeMealName.bind(this);
        this.handleAddMeal = this.handleAddMeal.bind(this);
        this.handleChangeMealTime = this.handleChangeMealTime.bind(this);
        this.handleChangeMealFoods = this.handleChangeMealFoods.bind(this);
        this.handleRemoveMeal = this.handleRemoveMeal.bind(this);
    }

    private handleChangeName(e) {
        const nextMealPlan = { ...this.props.dayMealPlan, name: e.target.value };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    private handleChangeMealName(nextName, index) {
        const nextMeals = [...this.props.dayMealPlan.meals];
        nextMeals[index] = { ...this.props.dayMealPlan.meals[index], name: nextName };
        const nextMealPlan = { ...this.props.dayMealPlan, meals: nextMeals };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    private handleChangeMealTime(nextTimeStr: string, index: number) {
        const nextMeals = [...this.props.dayMealPlan.meals];
        nextMeals[index] = { ...this.props.dayMealPlan.meals[index], time: Time.parse(nextTimeStr) };
        const nextMealPlan = { ...this.props.dayMealPlan, meals: nextMeals };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    private handleAddMeal() {
        const lastTime = _.get(this.props.dayMealPlan.meals[this.props.dayMealPlan.meals.length - 1], 'time', new Time(0, 0)) as Time;
        const nextTime = new Time(lastTime.hours, lastTime.minutes);
        const meal: IMeal = { name: '', time: nextTime, foods: [] };
        const nextMealPlan = { ...this.props.dayMealPlan, meals: [...this.props.dayMealPlan.meals, meal] };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    private handleChangeMealFoods(ingredients: IIngredient[], index: number) {
        const nextMeals = [...this.props.dayMealPlan.meals];
        nextMeals[index] = { ...this.props.dayMealPlan.meals[index], foods: ingredients };
        const nextMealPlan = { ...this.props.dayMealPlan, meals: nextMeals };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    private handleRemoveMeal(meal: IMeal, index: number) {
        const nextMeals = [...this.props.dayMealPlan.meals];
        nextMeals.splice(index, 1);
        const nextMealPlan = { ...this.props.dayMealPlan, meals: nextMeals };
        this.props.onChangeDayMealPlan(nextMealPlan);
    }

    public render() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="foodName">Name</label>
                    <input type="text" className="form-control" id="foodName" placeholder="Name" value={this.props.dayMealPlan.name} onChange={this.handleChangeName} />
                </div>

                <div className="form-group">
                    <label>Meals</label>
                    <ol className="list-items">
                        {_.map(this.props.dayMealPlan.meals, (meal, index) => (
                            <li key={index} className="list-items-row">
                                <div data-toggle="collapse" aria-expanded="false" data-target={'#list-item-line-' + index}>
                                    <div className="row">
                                        <div className="col-md-1">
                                            <i className="glyph glyph-add"></i>
                                            <i className="glyph glyph-remove"></i>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor={'mealName-' + index}>Name</label>
                                            <input type="text" className="form-control" id={'mealName-' + index} placeholder="Name" value={meal.name} onChange={(e) => this.handleChangeMealName(e.target.value, index)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor={'mealTime-' + index}>Time</label>
                                            <input type="time" className="form-control" id={'mealTime-' + index} placeholder="Name" value={meal.time && meal.time.toString()} onChange={(e) => this.handleChangeMealTime(e.target.value, index)} />
                                        </div>
                                        <div className="col-md-1">
                                            <a href="javascript:void(0)" onClick={(e) => this.handleRemoveMeal(meal, index)}><span className="glyph glyph-delete"></span></a>
                                        </div>
                                    </div>
                                </div>

                                <div className="collapse" id={'list-item-line-' + index}>
                                    <div className="row">
                                        <div className="col-md-24">
                                            <label>Ingredients</label>
                                            <IngredientsGrid
                                                ingredients={meal.foods}
                                                onChange={(ingredients) => this.handleChangeMealFoods(ingredients, index)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li key="index" className="list-items-row">
                            <a className="btn btn-primary" href="javascript:void(0)" onClick={this.handleAddMeal}>Add meal</a>
                        </li>
                    </ol>
                </div>

                <div className="form-group">
                    <label>Nutrition facts</label>
                    <NutrientsGrid isReadOnly={true} nutrients={getMealPlanNutrition(this.props.dayMealPlan).nutrients} />
                </div>
            </form>
        );
    };
}
