import * as React from 'react';
import { IServing } from '../contracts';
import EasyGrid, { FieldDefinition, createRowRemovalField, createEditableField, createRowCreationFooter } from './EasyGrid';

class EasyGridWrapper extends EasyGrid<IServing> { }

interface ServingsGridProps
{
    allowEmpty?: boolean;
    servings: IServing[];
    onChange: (this: void, servings: IServing[]) => void;
}

export default class ServingsGrid extends React.Component<ServingsGridProps, {}> {
    static defaultProps: Partial<ServingsGridProps> = {
        allowEmpty: false
    };

    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    private handleCreate() {
        const nextServings = [...this.props.servings, { name: 'Serving', grams: 100 }];
        this.props.onChange(nextServings);
    }

    private handleRemove(serving: IServing, index: number) {
        const nextServings = [...this.props.servings];
        nextServings.splice(index, 1);
        this.props.onChange(nextServings);
    }

    private handleUpdate(serving: IServing, index: number) {
        const nextServings = [...this.props.servings];
        nextServings[index] = { ...serving, grams: serving.grams };
        this.props.onChange(nextServings);
    }

    public componentWillMount() {
        if (!this.props.allowEmpty && this.props.servings.length == 0) {
            this.handleCreate();
        }
    }

    public render() {
        const data = this.props.servings;

        const fields: Array<FieldDefinition<IServing>> = [
            createEditableField('Serving name', row => row.name, (row, name) => ({ ...row, name }), this.handleUpdate, createRowCreationFooter(this.handleCreate)),
            createEditableField('Weight, grams', row => row.grams, (row, grams) => ({ ...row, grams }), this.handleUpdate)
        ];

        if (this.props.allowEmpty || data.length > 1) {
            fields.push(createRowRemovalField(this.handleRemove));
        }

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter={true} />
        );
    }
}
