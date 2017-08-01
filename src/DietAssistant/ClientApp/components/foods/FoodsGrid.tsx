import * as React from 'react';
import * as _ from 'lodash';
import { IFood } from '../../contracts';
import EasyGrid, { createRowRemovalField, createRowCreationFooter } from '../EasyGrid';

class EasyGridWrapper extends EasyGrid<IFood> { }

interface FoodsGridProps {
    foods: IFood[],
    onChange?: (this: void, foods: IFood[]) => void;
    onUpdate?: (this: void, food: IFood) => void;
    onRemove?: (this: void, food: IFood) => void;
    onSelect?: (this: void, food: IFood) => void;
    onCreate?: (this: void) => void;
}

export default class FoodsGrid extends React.Component<FoodsGridProps, {}> {
    static defaultProps: Partial<FoodsGridProps> = {
        onChange: () => { },
        onUpdate: () => { },
        onRemove: () => { },
        onCreate: () => { }
    };

    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    private handleCreate() {
        this.props.onCreate();
    }

    private handleRemove(food: IFood, index: number) {
        const nextFoods = [...this.props.foods];
        nextFoods.splice(index, 1);
        this.props.onChange(nextFoods);
        this.props.onRemove(food);
    }

    private handleUpdate(food: IFood, index: number) {
        const nextFoods = [...this.props.foods];
        nextFoods[index] = food;
        this.props.onChange(nextFoods);
        this.props.onUpdate(food);
    }

    public render() {
        const data = this.props.foods;
        const fields = [
            { header: 'Name', content: (row) => <a href="javascript:void(0)" onClick={(e) => this.props.onSelect(row)}>{row.name || '(no name)'}</a>, footer: createRowCreationFooter(this.handleCreate) },
            createRowRemovalField(this.handleRemove)
        ];

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter />
        );
    };
}
