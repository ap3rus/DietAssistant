import * as React from 'react';
import * as _ from 'lodash';
import * as enumHelpers from '../enumHelpers';
import { INutrient, NutrientType } from '../contracts';
import EasyGrid, { createRowRemovalField, createEditableField, createRowCreationFooter, createDropdownField } from './EasyGrid';

class EasyGridWrapper extends EasyGrid<INutrient> { }

interface NutrientsGridProps
{
    nutrients: INutrient[];
    isReadOnly?: boolean;
    onChange?: (this: void, nutrients: INutrient[]) => void;
}

export default class NutrientsGrid extends React.Component<NutrientsGridProps, {}> {
    public static defaultProps: Partial<NutrientsGridProps> = {
        onChange: () => { }
    };

    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    private getNextAvailableNutrientType(): NutrientType {
        const existingNutrientsByType = _.keyBy(this.props.nutrients, nutrient => nutrient.type);

        return _.find(enumHelpers.getValues(NutrientType), type => !existingNutrientsByType[type]);
    }

    private handleCreate() {
        const nextNutrients = [...this.props.nutrients, { type: this.getNextAvailableNutrientType(), grams: 0 }];
        this.props.onChange(nextNutrients);
    }

    private handleRemove(nutrient: INutrient, index: number) {
        const nextNutrients = [...this.props.nutrients];
        nextNutrients.splice(index, 1);
        this.props.onChange(nextNutrients);
    }

    private handleUpdate(nutrient: INutrient, index: number) {
        if (_.some(this.props.nutrients, (n: INutrient, i: number) => index !== i && n.type == nutrient.type)) {
            return;
        }

        const nextNutrients = [...this.props.nutrients];
        nextNutrients[index] = nutrient;
        this.props.onChange(nextNutrients);
    }

    public render() {
        const data = this.props.nutrients;
        const fields = this.props.isReadOnly ?
            [
                { header: 'Nutrient', content: (row) => isNaN(parseInt(row.type, 10)) ? row.type : NutrientType[row.type] },
                { header: 'Amount, grams', content: (row) => row.grams }
            ] :
            [
                createDropdownField(
                    'Nutrient',
                    _.map(enumHelpers.getValues(NutrientType), (value: NutrientType) => ({ value, content: NutrientType[value] })),
                    row => row.type,
                    (row, type) => ({ ...row, type }),
                    this.handleUpdate,
                    "(choose nutrient)",
                    !_.isUndefined(this.getNextAvailableNutrientType()) && createRowCreationFooter(this.handleCreate)
                ),
                createEditableField('Amount, grams', row => row.grams, (row, grams) => ({ ...row, grams }), this.handleUpdate),
                createRowRemovalField(this.handleRemove)
            ];

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter={!this.props.isReadOnly} />
        );
    }
}
