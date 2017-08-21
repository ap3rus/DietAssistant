import * as React from 'react';
import * as _ from 'lodash';
import { IIngredient, IServing, IFood, IRecipe, getIngredientWeight, getIngredientNutrition, getIngredientServings, compareServings } from '../contracts';
import EasyGrid, { FieldDefinition, createRowRemovalField, createEditableField, createRowCreationFooter, createDropdownField, editable, dropdown } from './EasyGrid';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

class EasyGridWrapper extends EasyGrid<IIngredient> { }

interface IngredientsGridProps {
    unavailableFoodIds?: string[];
    unavailableRecipeIds?: string[];
    foods?: IFood[];
    recipes?: IRecipe[];
    ingredients: IIngredient[];
    onChange: (this: void, ingredients: IIngredient[]) => void;
}

class IngredientsGrid extends React.Component<IngredientsGridProps, {}> {
    static defaultProps: Partial<IngredientsGridProps> = {
        unavailableFoodIds: [],
        unavailableRecipeIds: [],
        foods: [],
        recipes: []
    }

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    private handleChange({ data }: { data: IIngredient[] }) {
        this.props.onChange(data);
    }

    private handleCreate() {
        const nextIngredients = [...this.props.ingredients, { amount: 0, unit: null, food: null }];
        this.props.onChange(nextIngredients);
    }

    private handleRemove(ingredient: IIngredient, index: number) {
        const nextIngredients = [...this.props.ingredients];
        nextIngredients.splice(index, 1);
        this.props.onChange(nextIngredients);
    }

    private handleUpdate(ingredient: IIngredient, index: number) {
        const nextIngredients = [...this.props.ingredients];
        nextIngredients[index] = ingredient;
        this.props.onChange(nextIngredients);
    }

    public render() {
        const foodOptions = _.map(_.reject(this.props.foods, (food) => _.includes(this.props.unavailableFoodIds, food.id)), (food: IFood) => ({ value: food.id, content: food.name }));
        const recipeOptions = _.map(_.reject(this.props.recipes, (recipe) => _.includes(this.props.unavailableRecipeIds, recipe.id)), (recipe: IRecipe) => ({ value: recipe.id, content: recipe.name }));

        const fields: Array<FieldDefinition<IIngredient>> = [
            {
                header: 'Name',
                content: (ingredient: IIngredient, index) => ingredient.food ?
                    ingredient.food.name :
                    dropdown(
                        null,
                        [
                            { header: 'Foods', options: foodOptions },
                            { header: 'Recipes', options: recipeOptions }
                        ],
                        (id) => this.handleUpdate({ ...ingredient, food: _.find(this.props.foods, food => food.id == id) || _.find(this.props.recipes, recipe => recipe.id == id) }, index),
                        "(find food)"),
                footer: (foodOptions.length > 0 || recipeOptions.length > 0) ?
                    createRowCreationFooter(this.handleCreate) : null
            },
            {
                header: 'Amount',
                content: (row, index) => row.food && editable(row.amount, (amount) => this.handleUpdate({ ...row, amount }, index))
            },
            {
                header: 'Unit',
                content: (ingredient, index) => ingredient.food && dropdown(
                    ingredient.unit,
                    _.map(getIngredientServings(ingredient), (serving: IServing) => ({ value: serving, content: serving.name })),
                    (serving) => this.handleUpdate({ ...ingredient, unit: serving }, index),
                    "(choose serving)",
                    compareServings)
            },
            { header: 'Weight, grams', content: (row: IIngredient) => row.food && getIngredientWeight(row) },
            createRowRemovalField(this.handleRemove)
        ];
        const data = this.props.ingredients;

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter />
        );
    }
}

export default connect((state: ApplicationState) => ({ foods: state.foods.foods, recipes: state.recipes.recipes } as Partial<IngredientsGridProps>), {})(IngredientsGrid) as typeof IngredientsGrid;
