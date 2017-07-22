import * as React from 'react';
import { Serving } from '../contracts';
import SimpleGrid from './simpleGrid';

interface ServingsGridProps
{
    servings: Serving[];
    onChange: (this: void, servings: Serving[]) => void;
    onCreate: (this: void, serving: Serving) => void;
}

export default class ServingsGrid extends React.Component<ServingsGridProps, {}> {
    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
    }

    private handleCreate() {
        this.props.onCreate(new Serving('Serving', 100));
    }

    public render() {
        const fields = { name: 'Serving name', grams: 'Weight, grams' };
        const data = this.props.servings;

        return (
            <SimpleGrid
                fields={fields} data={data} onChange={this.props.onChange} onCreate={this.handleCreate}
            />
        );
    }
}
