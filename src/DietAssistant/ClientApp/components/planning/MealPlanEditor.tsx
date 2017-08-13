import * as React from 'react';
import * as _ from 'lodash';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import { IDayMealPlan, IMeal, Time, getMealPlanNutrition } from '../../contracts';
import { dropdown } from '../EasyGrid';

interface MealPlanEditorProps {
    mealPlan: IDayMealPlan;
    onChangeMealPlan: (this: void, mealPlan: IDayMealPlan) => void;
}

export default class MealPlanEditor extends React.Component<MealPlanEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeMealName = this.handleChangeMealName.bind(this);
        this.handleAddMeal = this.handleAddMeal.bind(this);
        this.handleChangeMealTime = this.handleChangeMealTime.bind(this);
    }

    private handleChangeName(e) {
        const nextMealPlan = { ...this.props.mealPlan, name: e.target.value };
        this.props.onChangeMealPlan(nextMealPlan);
    }

    private handleChangeMealName(nextName, index) {
        const nextMeals = [...this.props.mealPlan.meals];
        nextMeals[index] = { ...this.props.mealPlan.meals[index], name: nextName };
        const nextMealPlan = { ...this.props.mealPlan, meals: nextMeals };
        this.props.onChangeMealPlan(nextMealPlan);
    }

    private handleChangeMealTime(nextTime, index) {
        const nextMeals = [...this.props.mealPlan.meals];
        nextMeals[index] = { ...this.props.mealPlan.meals[index], time: Time.parse(nextTime) };
        const nextMealPlan = { ...this.props.mealPlan, meals: nextMeals };
        this.props.onChangeMealPlan(nextMealPlan);
    }

    private handleAddMeal() {
        const lastTime = _.get(this.props.mealPlan.meals[this.props.mealPlan.meals.length - 1], 'time', new Time(0, 0)) as Time;
        const nextTime = new Time(lastTime.hours, lastTime.minutes);
        const meal: IMeal = { name: '', time: nextTime, foods: [] };
        const nextMealPlan = { ...this.props.mealPlan, meals: [...this.props.mealPlan.meals, meal] };
        this.props.onChangeMealPlan(nextMealPlan);
    }

    public render() {
        return (
            <form className="theme-alt">
                <div className="form-group">
                    <label htmlFor="foodName">Name</label>
                    <input type="text" className="form-control" id="foodName" placeholder="Name" value={this.props.mealPlan.name} onChange={this.handleChangeName} />
                </div>

                <div className="form-group">
                    <label>Meals</label>
                    <ol className="list-items">
                        {_.map(this.props.mealPlan.meals, (meal, index) => (
                            <li key={index} className="list-items-row">
                                <div>
                                    <div className="row">
                                        <div className="col-md-1" data-toggle="collapse" aria-expanded="false" data-target={'#list-item-line-' + index}>
                                            <i className="glyph glyph-add"></i>
                                            <i className="glyph glyph-remove"></i>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor={'mealName-' + index}>Name</label>
                                            <input type="text" className="form-control" id={'mealName-' + index} placeholder="Name" value={meal.name} onChange={(e) => this.handleChangeMealName(e.target.value, index)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor={'mealTime-' + index}>Time</label>
                                            <input type="time" className="form-control" id={'mealTime-' + index} placeholder="Name" value={meal.time.toString()} onChange={(e) => this.handleChangeMealTime(e.target.value, index)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="collapse" id={'list-item-line-' + index}>
                                    <div className="row">
                                        <div className="col-md-18 col-md-offset-2">
                                            Lorem ipsum dolor sit amet.
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <button className="btn btn-primary btn-sm">Button</button>
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
                    <NutrientsGrid isReadOnly={true} nutrients={getMealPlanNutrition(this.props.mealPlan).nutrients} />
                </div>
            </form>
        );
    };
}
