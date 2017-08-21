import * as React from 'react';
import * as _ from 'lodash';
import { IDayMealPlan } from '../../contracts';
import EasyGrid, { createRowRemovalField, createRowCreationFooter } from '../EasyGrid';

class EasyGridWrapper extends EasyGrid<IDayMealPlan> { }

interface DayMealPlansGridProps {
    dayMealPlans: IDayMealPlan[],
    onChange?: (this: void, dayMealPlans: IDayMealPlan[]) => void;
    onUpdate?: (this: void, dayMealPlan: IDayMealPlan) => void;
    onRemove?: (this: void, dayMealPlan: IDayMealPlan) => void;
    onSelect?: (this: void, dayMealPlan: IDayMealPlan) => void;
    onCreate?: (this: void) => void;
}

export default class DayMealPlansGrid extends React.Component<DayMealPlansGridProps, {}> {
    static defaultProps: Partial<DayMealPlansGridProps> = {
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

    private handleRemove(dayMealPlan: IDayMealPlan, index: number) {
        const nextDayMealPlans = [...this.props.dayMealPlans];
        nextDayMealPlans.splice(index, 1);
        this.props.onChange(nextDayMealPlans);
        this.props.onRemove(dayMealPlan);
    }

    private handleUpdate(dayMealPlan: IDayMealPlan, index: number) {
        const nextDayMealPlans = [...this.props.dayMealPlans];
        nextDayMealPlans[index] = dayMealPlan;
        this.props.onChange(nextDayMealPlans);
        this.props.onUpdate(dayMealPlan);
    }

    public render() {
        const data = this.props.dayMealPlans;
        const fields = [
            { header: 'Name', content: (row) => <a href="javascript:void(0)" onClick={(e) => this.props.onSelect(row)}>{row.name || '(no name)'}</a>, footer: createRowCreationFooter(this.handleCreate) },
            createRowRemovalField(this.handleRemove)
        ];

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter />
        );
    };
}
