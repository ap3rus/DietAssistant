import * as React from 'react';
import * as _ from 'lodash';
import { IIngredient, IServing, getIngredientWeight, getIngredientNutrition } from '../contracts';
import EasyGrid, { createRowRemovalField, createEditableField, createRowCreationFooter, createDropdownField } from './easyGrid';

class EasyGridWrapper extends EasyGrid<IIngredient> { }


interface IngredientsGridProps {
    ingredients: IIngredient[];
    onChange: (this: void, ingredients: IIngredient[]) => void;
    onCreate: (this: void) => void;
}

export default class IngredientsGrid extends React.Component<IngredientsGridProps, {}> {
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
        // todo
        //const nextIngredients = [...this.props.ingredients, {  }];
        //this.props.onChange(nextIngredients);
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
        const fields = [
            { header: 'Name', content: (row: IIngredient) => row.food.name, footer: createRowCreationFooter(this.handleCreate) },
            createEditableField('Amount', (row: IIngredient) => row.amount, (row: IIngredient, amount) => ({ ...row, amount }), this.handleUpdate),
            createDropdownField(
                'Nutrient',
                row => _.map(row.food.servings, (serving: IServing) => ({ value: serving.grams, content: serving.name })),
                row => row.unit && row.unit.grams,
                (row, grams) => ({ ...row, unit: _.find(row.food.servings, serving => serving.grams == grams) }),
                this.handleUpdate
            ),
            { header: 'Weight, grams', content: (row: IIngredient) => getIngredientWeight(row) },
        ];
        const data = this.props.ingredients;

        return (
            <EasyGridWrapper fields={fields} data={data} />
        );
    }
}
