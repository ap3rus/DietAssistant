import * as React from 'react';
import { IServing } from '../contracts';
import SimpleGrid from './simpleGrid';

interface ServingsGridProps
{
    servings: IServing[];
    onChange: (this: void, servings: IServing[]) => void;
    onCreate: (this: void, serving: IServing) => void;
}

export default class ServingsGrid extends React.Component<ServingsGridProps, {}> {
    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    private handleCreate() {
        this.props.onCreate({ name: 'Serving', grams: 100 });
    }

    private handleChange({ data }: { data: IServing[] }) {
        this.props.onChange(data);
    }

    public render() {
        const fields = { name: 'Serving name', grams: 'Weight, grams' };
        const data = this.props.servings;

        return (
            <SimpleGrid
                fields={fields} data={data} onChange={this.handleChange} onCreate={this.handleCreate}
            />
        );
    }
}
