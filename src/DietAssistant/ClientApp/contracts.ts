import * as _ from 'lodash';

export class Time {
    constructor(public hours: number, public minutes: number) {
    }

    toString() {
        return `${this.hours < 10 ? '0' : ''}${this.hours}:${this.minutes < 10 ? '0' : ''}${this.minutes}`;
    }

    static parse(timeStr: string): Time {
        const match = timeStr.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/);
        if (match) {
            return new Time(parseInt(match[1], 10), parseInt(match[2], 10));
        }
    }
}

export interface IIdentifiable {
    id?: string;
}

export enum NutrientType {
    Carbs,
    Fat,
    Protein,
    Sodium,
    Sugars
}

export interface INutrient {
    type: NutrientType;
    grams: number;
}

export interface IServing {
    name: string;
    grams: number;
}

export interface INutrition {
    name: string;
    unit: IServing;
    nutrients: INutrient[];
}

export interface IFood extends INutrition, IIdentifiable {
    servings: IServing[];
}

export interface IRecipe extends IIdentifiable {
    name: string;
    notes: string;
    unit: IServing;
    servings: IServing[];
    ingredients: IIngredient[];
}

// todo replace food with foodId + create selector
export interface IIngredient {
    amount: number;
    unit: IServing;
    food: IFood | IRecipe;
}

export interface IMeal {
    name: string;
    time: Time;
    foods: IIngredient[];
}

export interface IDayMealPlan {
    name: string;
    meals: IMeal[];
}

export interface IDayMealLog {
    date: Date;
    meals: IMeal[];
    plan: IDayMealPlan;
}

function changeServing(nutrient: INutrient, from: IServing, to: IServing): INutrient {
    return { type: nutrient.type, grams: nutrient.grams * to.grams / from.grams };
}

export function getIngredientNutrition(ingredient: IIngredient): INutrition {
    const ingredientNutrients = (ingredient.food as IFood).nutrients ?
        (ingredient.food as IFood).nutrients :
        getRecipeNutrition(ingredient.food as IRecipe).nutrients;

    const nutrients = ingredient.food.unit && ingredient.unit ?
        ingredientNutrients.map(nutrient => changeServing(nutrient, ingredient.food.unit, ingredient.unit)) :
        ingredientNutrients;
    return { name: ingredient.food.name, unit: ingredient.unit, nutrients };
}

export function getIngredientWeight(ingredient: IIngredient) {
    const weight = ingredient.amount * (ingredient.unit && ingredient.unit.grams);
    if (isNaN(weight)) {
        return 0;
    }

    return weight;
}

function composeNutritions(name: string, nutritions: INutrition[]): INutrition {
    const result: { [id: number]: number } = {};
    const unit: IServing = { name: 'Serving', grams: 0 };

    for (let nutrition of nutritions) {
        unit.grams += nutrition.unit && nutrition.unit.grams || 0;
        if (!nutrition.nutrients) {
            continue;
        }

        for (let nutrient of nutrition.nutrients) {
            const current: number = result[nutrient.type] || 0;
            result[nutrient.type] = current + nutrient.grams;
        }
    }

    const nutrients = Object.keys(result).map((type) => ({ type: NutrientType[type], grams: result[type] }));
    return { name, unit, nutrients };
}

export function getRecipeNutrition(recipe: IRecipe): INutrition {
    const nutrition = composeNutritions(recipe.name, _.filter(_.map(recipe.ingredients, ingredient => ingredient.food && getIngredientNutrition(ingredient))));
    const nutrients = nutrition.unit && recipe.unit ?
        _.map(nutrition.nutrients, nutrient => changeServing(nutrient, nutrition.unit, recipe.unit)) :
        nutrition.nutrients;
    return { name: recipe.name, unit: recipe.unit, nutrients };
}

export function getMealNutrition(meal: IMeal): INutrition {
    return composeNutritions(meal.name, _.map(meal.foods, ingredient => getIngredientNutrition(ingredient)));
}

export function getMealPlanNutrition(plan: IDayMealPlan): INutrition {
    const mealsNutritions = _.map(plan.meals, meal => getMealNutrition(meal));
    return composeNutritions(plan.name, mealsNutritions);
}
