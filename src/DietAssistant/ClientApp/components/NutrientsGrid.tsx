import * as React from 'react';
import { Nutrient, NutrientType } from '../contracts';
import * as enumHelpers from '../enumHelpers';
import SimpleGrid from './simpleGrid';
import * as _ from 'lodash';

interface NutrientsGridProps
{
    nutrients: Nutrient[];
    isReadOnly?: boolean;
    onChange?: (this: void, nutrients: Nutrient[]) => void;
    onCreate?: (this: void, nutrient: Nutrient) => void;
}

export default class NutrientsGrid extends React.Component<NutrientsGridProps, {}> {
    public static defaultProps: Partial<NutrientsGridProps> = {
        onChange: () => { },
        onCreate: () => { }
    };

    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    private handleCreate() {
        this.props.onCreate(new Nutrient(this.getNextAvailableNutrientType(), 0));
    }

    private handleChange({ data }: { data: Nutrient[] }) {        
        const checkNutrients = _.reduce(data, (result, nutrient) => {
            if (result && !result[nutrient.type]) {
                result[nutrient.type] = true;
                return result;
            }
        }, {});

        if (checkNutrients) {
            this.props.onChange(data);
        }
    }

    private getNextAvailableNutrientType(): NutrientType {
        const existingNutrientsByType = _.keyBy(this.props.nutrients, nutrient => nutrient.type);

        return _.find(enumHelpers.getValues(NutrientType), type => !existingNutrientsByType[type]);
    }

    public render() {
        const fields = {
            type: {
                name: 'Nutrient',
                values: enumHelpers.keyByValues(NutrientType)
            },
            grams: 'Amount, grams'
        };
        const data = this.props.nutrients;

        return (
            <SimpleGrid
                fields={fields}
                data={data}
                onChange={this.handleChange}
                onCreate={this.handleCreate}
                canCreate={!this.props.isReadOnly && this.getNextAvailableNutrientType() !== undefined}
                isReadOnly={this.props.isReadOnly}
            />
        );
    }
}
