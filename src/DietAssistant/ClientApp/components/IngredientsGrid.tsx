import * as React from 'react';
import * as _ from 'lodash';
import { Ingredient, IServing } from '../contracts';
import SimpleGrid from './simpleGrid';

interface IngredientsGridProps {
    ingredients: Ingredient[];
    onChange: (this: void, ingredients: Ingredient[]) => void;
    onCreate: (this: void) => void;
}

export default class IngredientsGrid extends React.Component<IngredientsGridProps, {}> {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange({ data }: { data: Ingredient[] }) {
        this.props.onChange(data);
    }

    public render() {
        const fields = {
            name: {
                name: 'Name',
                isReadOnly: true
            },
            amount: 'Amount',
            'unit.grams': {
                name: 'Unit',
                values: (row: Ingredient) => {
                    return _.reduce(row.food.servings, (result, serving: IServing) => {
                        result[serving.grams] = serving.name;
                        return result;
                    }, {});
                },
                updater: (row: Ingredient, propertyName: string, value: any) => {
                    row.unit = _.find(row.food.servings, serving => serving.grams == value);
                }
            },
            'weight': {
                name: 'Weight, grams',
                isReadOnly: true
            }
        };
        const data = this.props.ingredients;

        return (
            <SimpleGrid
                fields={fields} data={data} onChange={this.handleChange} onCreate={this.props.onCreate} cloneRow={ingredient => new Ingredient(ingredient)}
            />
        );
    }
}
