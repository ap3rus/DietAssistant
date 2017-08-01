﻿import * as _ from 'lodash';
// todo get rid of classes

export interface IIdentifiable {
    id?: string;
}

export interface INutrition {
    name: string;
    unit: IServing;
    nutrients: INutrient[];
}

export interface IFood extends INutrition, IIdentifiable {
    servings: IServing[];
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

function changeServing(nutrient: INutrient, from: IServing, to: IServing): INutrient {
    return { type: nutrient.type, grams: nutrient.grams * to.grams / from.grams };
}

export interface IIngredient {
    amount: number;
    unit: IServing;
    food: IFood;
}

export function getIngredientNutrition(ingredient: IIngredient): INutrition {
    const nutrients = ingredient.food.unit && ingredient.unit ?
        ingredient.food.nutrients.map(nutrient => changeServing(nutrient, ingredient.food.unit, ingredient.unit)) :
        ingredient.food.nutrients;
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

export interface IRecipe extends IIdentifiable {
    name: string;
    notes: string;
    unit: IServing;
    servings: IServing[];
    ingredients: IIngredient[];
}

export function getRecipeNutrition(recipe: IRecipe): INutrition {
    const nutrition = composeNutritions(_.filter(_.map(recipe.ingredients, ingredient => ingredient.food && getIngredientNutrition(ingredient))));
    const nutrients = nutrition.unit && recipe.unit ?
        _.map(nutrition.nutrients, nutrient => changeServing(nutrient, nutrition.unit, recipe.unit)) :
        nutrition.nutrients;
    return { name: recipe.name, unit: recipe.unit, nutrients };
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

export interface IDayMealPlan {
    name: string;
    meals: IMeal[];
}

export interface IDayMealLog {
    date: Date;
    meals: IMeal[];
    plan: IDayMealPlan;
}
