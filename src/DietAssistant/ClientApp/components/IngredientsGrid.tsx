import * as React from 'react';
import * as _ from 'lodash';
import { IIngredient, IServing, getIngredientWeight, getIngredientNutrition } from '../contracts';
import SimpleGrid from './simpleGrid';

interface IngredientsGridProps {
    ingredients: IIngredient[];
    onChange: (this: void, ingredients: IIngredient[]) => void;
    onCreate: (this: void) => void;
}

export default class IngredientsGrid extends React.Component<IngredientsGridProps, {}> {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange({ data }: { data: IIngredient[] }) {
        this.props.onChange(data);
    }

    public render() {
        const fields = {
            'food.name': {
                name: 'Name',
                isReadOnly: true
            },
            amount: 'Amount',
            'unit.grams': {
                name: 'Unit',
                values: (row: IIngredient) => {
                    return _.reduce(row.food.servings, (result, serving: IServing) => {
                        result[serving.grams] = serving.name;
                        return result;
                    }, {});
                },
                updater: (row: IIngredient, propertyName: string, value: any) => {
                    row.unit = _.find(row.food.servings, serving => serving.grams == value);
                }
            },
            'weight': {
                name: 'Weight, grams',
                isReadOnly: true
            }
        };
        const data = _.map(this.props.ingredients, ingredient => ({ ...ingredient, weight: getIngredientWeight(ingredient) }));

        return (
            <SimpleGrid
                fields={fields} data={data} onChange={this.handleChange} onCreate={this.props.onCreate}
            />
        );
    }
}
