import * as React from 'react';
import * as _ from 'lodash';

interface ComponentProps {
}

export default class Component extends React.PureComponent<ComponentProps> {
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
