import * as React from 'react';
import * as _ from 'lodash';
import { IFood } from '../../contracts';
import SimpleGrid from '../simpleGrid';

interface FoodsGridProps {
    foods: IFood[],
    onChange?: (this: void, foods: IFood[]) => void;
    onUpdate?: (this: void, food: IFood) => void;
    onRemove?: (this: void, food: IFood) => void;
    onCreate?: (this: void) => void;
}

export default class FoodsGrid extends React.Component<FoodsGridProps, {}> {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange({ data, removed, updated }: { data: IFood[], removed: IFood, updated: IFood }) {
        this.props.onChange(data);
        if (removed) {
            this.props.onRemove(removed);
        }

        if (updated) {
            this.props.onUpdate(updated);
        }
    }

    public render() {
        const fields = {
            name: {
                name: 'Name',
                isReadOnly: true
            }
        };
        const data = this.props.foods;

        return (
            <SimpleGrid fields={fields} data={data} onChange={this.handleChange} onCreate={this.props.onCreate} />
        );
    };
}
