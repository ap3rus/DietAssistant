export interface INutrition {
    name: string;
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

    static oneGram = new Serving("gram", 1);
}

function changeServing(nutrient: Nutrient, from: Serving, to: Serving): Nutrient {
    return new Nutrient(nutrient.type, nutrient.grams * to.grams / from.grams);
}

export class Ingredient implements INutrition {
    constructor(ingredient?: Partial<Ingredient>) {
        if (ingredient) {
            this.amount = ingredient.amount;
            this.food = ingredient.food;
            this.unit = ingredient.unit || this.food && this.food.unit;
        }
    }

    amount: number;
    unit: Serving;
    food: IFood;
    get name(): string {
        return this.food.name;
    }
    get nutrients(): Nutrient[] {
        return this.food.nutrients.map(nutrient => changeServing(nutrient, this.food.unit, this.unit));
    }
    get weight(): number {
        const weight = this.amount * (this.unit && this.unit.grams);
        if (isNaN(weight)) {
            return null;
        }

        return weight;
    }
}

function sumUpNutritions(nutritions: INutrition[]): INutrition {
    const result: { [id: number]: number } = {};
    const name = 'Sum of nutritions';
    const unit = new Serving("Serving", 0);

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

    const nutrients = Object.keys(result).map((type) => new Nutrient(NutrientType[type], result[type]));
    return { name, unit, nutrients };
}

export class Food implements IFood {
    constructor(food?: Partial<Food>) {
        if (food) {
            this.name = food.name;
            this.unit = food.unit;
            this.servings = food.servings || [];
            this.nutrients = food.nutrients || [];
        }
    }

    name: string;
    unit: Serving;
    servings: Serving[] = [];
    nutrients: Nutrient[] = [];
}

export class Recipe implements IFood {
    constructor(recipe?: Partial<Recipe>) {
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
