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
    displayNameWithGrams?: string;
}

export const defaultNutritionUnit: IServing = { name: '100g', displayNameWithGrams: '100g', grams: 100 };
export const serving1g: IServing = { name: 'g', displayNameWithGrams: '1g', grams: 1 };

export interface INutrition {
    name: string;
    nutrients: INutrient[];
}

export interface IFood extends INutrition, IIdentifiable {
    servings: IServing[];
}

export interface IRecipe extends IIdentifiable {
    name: string;
    notes: string;
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

export function compareServings(serving1: IServing, serving2: IServing) {
    if (!serving1 || !serving2) {
        return false;
    }

    if (serving1 === serving2) {
        return true;
    }

    return serving1.grams === serving2.grams;
}

export function changeServing(nutrient: INutrient, from: IServing, to: IServing): INutrient {
    return { type: nutrient.type, grams: nutrient.grams * to.grams / from.grams };
}

export function getServingNameWithGrams(serving: IServing) {
    return serving.displayNameWithGrams ? serving.displayNameWithGrams : `${serving.name} - ${serving.grams}g`;
}

export function getFoodServings(food: IFood): IServing[] {
    return [defaultNutritionUnit, serving1g, ...food.servings];
}

export function getRecipeServings(recipe: IRecipe): IServing[] {
    return [
        getRecipeServing(recipe),
        serving1g,
        defaultNutritionUnit,
        ...recipe.servings
    ];
}

export function getIngredientServings(ingredient: IIngredient): IServing[] {
    if (!ingredient.food) {
        return [];
    }

    return (ingredient.food as IRecipe).ingredients ? getRecipeServings(ingredient.food as IRecipe) : getFoodServings(ingredient.food as IFood);
}

export function getIngredientNutrition(ingredient: IIngredient): INutrition {
    const nutritionUnit = ingredient.unit && { name: `${ingredient.amount} x ${ingredient.unit.name}`, grams: ingredient.unit.grams * ingredient.amount };
    let foodNutrients: INutrient[];
    let ingredientNutrients: INutrient[];
    let foodUnit: IServing;
    if ((ingredient.food as IFood).nutrients) {
        foodNutrients = (ingredient.food as IFood).nutrients;
        foodUnit = defaultNutritionUnit;
    } else {
        foodNutrients = getRecipeNutrition(ingredient.food as IRecipe).nutrients;
        foodUnit = getRecipeServing(ingredient.food as IRecipe);
    }

    ingredientNutrients = ingredient.unit ?
        foodNutrients.map(nutrient => changeServing(nutrient, foodUnit, nutritionUnit)) :
        foodNutrients;
    return { name: ingredient.food.name, nutrients: ingredientNutrients };
}

export function getIngredientWeight(ingredient: IIngredient) {
    const weight = ingredient.amount * (ingredient.unit && ingredient.unit.grams);
    if (isNaN(weight)) {
        return 0;
    }

    return weight;
}

function addUpNutritions(name: string, nutritions: INutrition[]): INutrition {
    const result: { [id: number]: number } = {};

    for (let nutrition of nutritions) {
        if (!nutrition.nutrients) {
            continue;
        }

        for (let nutrient of nutrition.nutrients) {
            const current: number = result[nutrient.type] || 0;
            result[nutrient.type] = current + nutrient.grams;
        }
    }

    const nutrients = _.map(result, (grams: number, type: number) => ({ type, grams }));
    return { name, nutrients };
}

export function getRecipeServing(recipe: IRecipe): IServing {
    const result: IServing = {
        name: 'Whole recipe',
        grams: _.sumBy(recipe.ingredients, (ingredient) => ingredient.unit && ingredient.amount * ingredient.unit.grams || 0)
    };

    return result;
}

export function getRecipeNutrition(recipe: IRecipe): INutrition {
    const nutrition = addUpNutritions(recipe.name, _.filter(_.map(recipe.ingredients, ingredient => ingredient.food && getIngredientNutrition(ingredient))));
    return nutrition;
}

export function getMealNutrition(meal: IMeal): INutrition {
    return addUpNutritions(meal.name, _.filter(_.map(meal.foods, ingredient => ingredient.food && getIngredientNutrition(ingredient))));
}

export function getMealPlanNutrition(plan: IDayMealPlan): INutrition {
    const mealsNutritions = _.map(plan.meals, meal => getMealNutrition(meal));
    return addUpNutritions(plan.name, mealsNutritions);
}
