export interface INutrition {
    unit: Serving;
    nutrients: Nutrient[];
}

export interface IFood extends INutrition {
    servings: Serving[];
}

export enum NutrientType {
    Carbs,
    Fat,
    Protein,
    Sugars,
    Sodium
}

export class Nutrient {
    constructor(type: NutrientType, grams: number) {
        this.type = type;
        this.grams = grams;
    }

    type: NutrientType;
    grams: number;
}

export class Serving {
    constructor(name: string, grams: number) {
        this.name = name;
        this.grams = grams;
    }

    name: string;
    grams: number;

    static hundredGrams = new Serving("100g", 100);
}

function changeServing(nutrient: Nutrient, from: Serving, to: Serving): Nutrient {
    return new Nutrient(nutrient.type, nutrient.grams * to.grams / from.grams);
}

export class Ingredient implements INutrition {
    amount: number;
    unit: Serving;
    food: IFood;
    get nutrients(): Nutrient[] {
        return this.food.nutrients.map(nutrient => changeServing(nutrient, this.food.unit, this.unit));
    }
}

function sumUpNutritions(nutritions: INutrition[]): INutrition {
    const result: { [id: number]: number } = {};
    const unit = new Serving("Serving", 0);

    for (let nutrition of nutritions) {
        unit.grams += nutrition.unit.grams;
        for (let nutrient of nutrition.nutrients) {
            const current: number = result[nutrient.type] || 0;
            result[nutrient.type] = current + nutrient.grams;
        }
    }

    const nutrients = Object.keys(result).map((type) => new Nutrient(NutrientType[type], result[type]));
    return { unit, nutrients };
}

export class Food implements IFood {
    name: string;
    unit: Serving;
    servings: Serving[] = [];
    nutrients: Nutrient[] = [];
}

export class Recipe implements IFood {
    name: string;
    notes: string;
    unit: Serving;
    servings: Serving[] = [];
    ingredients: Ingredient[] = [];
    get nutrients(): Nutrient[] {
        const nutrition = sumUpNutritions(this.ingredients);
        return nutrition.nutrients.map(nutrient => changeServing(nutrient, nutrition.unit, this.unit));
    }
}

export class Meal implements INutrition {
    name: string;
    time: Date;
    foods: Ingredient[] = [];
    get unit(): Serving {
        return sumUpNutritions(this.foods).unit;
    }
    get nutrients(): Nutrient[] {
        return sumUpNutritions(this.foods).nutrients;
    }
}

export class DayMealPlan implements INutrition {
    name: string;
    meals: Meal[] = [];
    get unit(): Serving {
        return sumUpNutritions(this.meals).unit;
    }
    get nutrients(): Nutrient[] {
        return sumUpNutritions(this.meals).nutrients;
    }
}

export class DayMealLog {
    date: Date;
    meals: Meal[] = [];
    plan: DayMealPlan;
}
