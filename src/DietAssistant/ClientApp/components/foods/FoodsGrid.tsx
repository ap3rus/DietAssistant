import * as React from 'react';
import * as _ from 'lodash';
import { Food } from '../../contracts';
import SimpleGrid from '../simpleGrid';

interface FoodsGridProps {
    foods: Food[],
    onChange?: (this: void, foods: Food[]) => void;
    onUpdate?: (this: void, food: Food) => void;
    onRemove?: (this: void, food: Food) => void;
    onCreate?: (this: void) => void;
}

export default class FoodsGrid extends React.Component<FoodsGridProps, {}> {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange({ data, removed, updated }: { data: Food[], removed: Food, updated: Food }) {
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
