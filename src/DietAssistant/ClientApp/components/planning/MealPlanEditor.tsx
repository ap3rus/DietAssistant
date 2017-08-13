import * as React from 'react';
import * as _ from 'lodash';

interface MealPlanEditorProps {
}

export default class MealPlanEditor extends React.PureComponent<MealPlanEditorProps> {
    constructor() {
        super();
        this.handleSomething = this.handleSomething.bind(this);
    }

    private handleSomething() {
    }

    public render() {
        return (
            <div></div>
        );
    };
}
