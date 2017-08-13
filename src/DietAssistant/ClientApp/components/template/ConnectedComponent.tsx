import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './actions';
import { State } from './reducer';
import Page from '../Page';

type ConnectedComponentProps =
    State &
    typeof actionCreators &
    RouteComponentProps<{}>;

class ConnectedComponent extends React.Component<ConnectedComponentProps, {}> {
    constructor() {
        super();

        this.handleSomething = this.handleSomething.bind(this);
    }

    handleSomething() {
    }

    public render() {
        return (
            <Page header="Foo">
                Bar
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state['foo'], actionCreators)(withRouter(ConnectedComponent)) as typeof ConnectedComponent;
