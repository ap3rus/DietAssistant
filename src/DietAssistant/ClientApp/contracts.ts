import * as _ from 'lodash';
// todo get rid of classes

export interface INutrition {
    name: string;
    unit: IServing;
    nutrients: INutrient[];
}

export interface IFood extends INutrition {
    servings: IServing[];
}

export enum NutrientType {
    Carbs,
    Fat,
    Protein,
    Sugars,
    Sodium
}

export interface INutrient {
    type: NutrientType;
    grams: number;
}

export interface IServing {
    name: string;
    grams: number;
}

function changeServing(nutrient: INutrient, from: IServing, to: IServing): INutrient {
    return { type: nutrient.type, grams: nutrient.grams * to.grams / from.grams };
}

export interface IIngredient {
    amount: number;
    unit: IServing;
    food: IFood;
}

export function getIngredientNutrition(ingredient: IIngredient): INutrition {
    const nutrients = ingredient.food.nutrients.map(nutrient => changeServing(nutrient, ingredient.food.unit, ingredient.unit));
    return { name: ingredient.food.name, unit: ingredient.unit, nutrients };
}

export function getIngredientWeight(ingredient: IIngredient) {
    const weight = ingredient.amount * (ingredient.unit && ingredient.unit.grams);
    if (isNaN(weight)) {
        return null;
    }

    return weight;
}

function composeNutritions(nutritions: INutrition[]): INutrition {
    const result: { [id: number]: number } = {};
    const name = 'Sum of nutritions';
    const unit: IServing = { name: "Serving", grams: 0 };

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

export class Food implements IFood {
    constructor(food?: Partial<IFood>) {
        if (food) {
            this.name = food.name;
            this.unit = food.unit;
            this.servings = food.servings || [];
            this.nutrients = food.nutrients || [];
        }
    }

    name: string;
    unit: IServing;
    servings: IServing[] = [];
    nutrients: INutrient[] = [];
}

export interface IRecipe {
    name: string;
    notes: string;
    unit: IServing;
    servings: IServing[];
    ingredients: IIngredient[];
}

function getRecipeNutrition(recipe: IRecipe): INutrition {
    const nutrition = composeNutritions(_.map(recipe.ingredients, ingredient => getIngredientNutrition(ingredient)));
    const nutrients = _.map(nutrition.nutrients, nutrient => changeServing(nutrient, nutrition.unit, recipe.unit));
    return { name: recipe.name, unit: recipe.unit, nutrients };
}

export class Recipe implements IFood, IRecipe {
    constructor(recipe?: Partial<IRecipe>) {
        if (recipe) {
            this.name = recipe.name;
            this.notes = recipe.notes;
            this.unit = recipe.unit;
            this.servings = recipe.servings || [];
            this.ingredients = recipe.ingredients || [];
        }
    }

    name: string;
    notes: string;
    unit: IServing;
    servings: IServing[] = [];
    ingredients: IIngredient[] = [];
    get nutrients(): INutrient[] {
        return getRecipeNutrition(this).nutrients;
    }
}

export interface IMeal {
    name: string;
    time: Date;
    foods: IIngredient[];
}

function getMealNutrition(meal: IMeal): INutrition {
    return composeNutritions(_.map(meal.foods, ingredient => getIngredientNutrition(ingredient)));
}

function getMealPlanNutrition(plan: IDayMealPlan): INutrition {
    const mealsNutritions = _.map(plan.meals, meal => getMealNutrition(meal));
    return composeNutritions(mealsNutritions);
}

export class Meal implements INutrition, IMeal {
    name: string;
    time: Date;
    foods: IIngredient[] = [];
    get unit(): IServing {
        return getMealNutrition(this).unit;
    }
    get nutrients(): INutrient[] {
        return getMealNutrition(this).nutrients;
    }
}

export interface IDayMealPlan {
    name: string;
    meals: IMeal[];
}

export class DayMealPlan implements INutrition, IDayMealPlan {
    name: string;
    meals: IMeal[] = [];
    get unit(): IServing {
        return getMealPlanNutrition(this).unit;
    }
    get nutrients(): INutrient[] {
        return getMealPlanNutrition(this).nutrients;
    }
}

export interface IDayMealLog {
    date: Date;
    meals: IMeal[];
    plan: DayMealPlan;
}
