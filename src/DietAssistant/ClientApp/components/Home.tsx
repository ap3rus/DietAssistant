import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ServingsGrid from './ServingsGrid';
import { Serving } from '../contracts';

interface HomeState {
    servings: Serving[]
}

export default class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();

        this.handleServingsChange = this.handleServingsChange.bind(this);
        this.handleCreateServing = this.handleCreateServing.bind(this);

        const servings = [];
        this.state = { servings };
    }

    handleServingsChange(servings: Serving[]) {
        this.setState({ servings });
    }

    handleCreateServing() {
        this.setState({ servings: [...this.state.servings, new Serving('Serving', 100)] });
    }

    public render() {

        return (
            <ServingsGrid onServingsChange={this.handleServingsChange} servings={this.state.servings} onCreateServing={this.handleCreateServing} />
        );
    }
}
