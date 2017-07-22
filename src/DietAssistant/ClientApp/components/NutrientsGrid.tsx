import * as React from 'react';
import { Nutrient, NutrientType } from '../contracts';
import SimpleGrid from './simpleGrid';

interface NutrientsGridProps
{
    nutrients: Nutrient[];
    onChange: (this: void, nutrients: Nutrient[]) => void;
    onCreate: (this: void, nutrient: Nutrient) => void;
}

export default class NutrientsGrid extends React.Component<NutrientsGridProps, {}> {
    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    private handleCreate() {
        this.props.onCreate(new Nutrient(this.getAvailableNutrientType(), 0));
    }

    private handleChange(nextNutrients: Nutrient[]) {
        const checkNutrients = nextNutrients.reduce((result, nutrient) => {
            if (!result || !result[nutrient.type]) {
                result[nutrient.type] = true;
                return result;
            }
        }, {});

        if (checkNutrients) {
            this.props.onChange(nextNutrients);
        }
    }

    private getAvailableNutrientType(): NutrientType {
        const allNutrientTypes = Object.keys(NutrientType)
            .filter(n => !isNaN(parseInt(n, 10)))
            .map(key => parseInt(key, 10) as NutrientType);

        const existingNutrientsByType = this.props.nutrients
            .reduce((result, nutrient) => {
                result[nutrient.type] = nutrient;
                return result;
            }, {});

        return allNutrientTypes.find(type => !existingNutrientsByType[type]);
    }

    public render() {
        const fields = {
            type: {
                name: 'Nutrient',
                values: Object.keys(NutrientType)
                    .filter(n => !isNaN(parseInt(n, 10)))
                    .map(key => ({ key: parseInt(key, 10) as NutrientType, value: NutrientType[key] }))
                    .reduce((result, item) => {
                        result[item.key] = item.value;
                        return result;
                    }, {})
            },
            grams: 'Amount, grams'
        };
        const data = this.props.nutrients;

        return (
            <SimpleGrid
                fields={fields} data={data} onChange={this.handleChange} onCreate={this.handleCreate} canCreate={this.getAvailableNutrientType() !== undefined}
            />
        );
    }
}
