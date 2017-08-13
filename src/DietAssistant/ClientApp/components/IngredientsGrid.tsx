import * as React from 'react';
import * as _ from 'lodash';
import { IIngredient, IServing, IFood, IRecipe, getIngredientWeight, getIngredientNutrition } from '../contracts';
import EasyGrid, { FieldDefinition, createRowRemovalField, createEditableField, createRowCreationFooter, createDropdownField, editable, dropdown } from './EasyGrid';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

class EasyGridWrapper extends EasyGrid<IIngredient> { }

interface IngredientsGridProps {
    unavailableRecipeIds?: string[];
    foods?: IFood[];
    recipes?: IRecipe[];
    ingredients: IIngredient[];
    onChange: (this: void, ingredients: IIngredient[]) => void;
    onCreate: (this: void) => void;
}

class IngredientsGrid extends React.Component<IngredientsGridProps, {}> {
    static defaultProps: Partial<IngredientsGridProps> = {
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
        const fields: Array<FieldDefinition<IIngredient>> = [
            {
                header: 'Name',
                content: (row: IIngredient, index) => row.food ?
                    row.food.name :
                    dropdown(
                        null,
                        [
                            { header: 'Foods', options: _.map(this.props.foods, (food: IFood) => ({ value: food.id, content: food.name })) },
                            { header: 'Recipes', options: _.map(_.reject(this.props.recipes, (recipe) => _.includes(this.props.unavailableRecipeIds, recipe.id)), (recipe: IRecipe) => ({ value: recipe.id, content: recipe.name })) }
                        ],
                        (id) => this.handleUpdate({ ...row, food: _.find(this.props.foods, food => food.id == id) || _.find(this.props.recipes, recipe => recipe.id == id) }, index),
                        "(find food)"),
                footer: createRowCreationFooter(this.handleCreate)
            },
            {
                header: 'Amount',
                content: (row, index) => row.food && editable(row.amount, (amount) => this.handleUpdate({ ...row, amount }, index))
            },
            {
                header: 'Unit',
                content: (row, index) => row.food && row.food.servings.length && dropdown(
                    row.unit && row.unit.grams,
                    _.map(row.food.servings, (serving: IServing) => ({ value: serving.grams, content: serving.name })),
                    (grams) => this.handleUpdate({ ...row, unit: _.find(row.food.servings, serving => serving.grams == grams) }, index),
                    "(choose serving)")
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
