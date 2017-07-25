import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './foodsActions';
import { FoodsState } from './foodsReducer';
import FoodsGrid from './FoodsGrid';

type FoodsProps =
    FoodsState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class Foods extends React.Component<FoodsProps, {}> {
    public render() {
        return (
            <div>
                <FoodsGrid foods={this.props.foods} />
            </div>
        );
    }
}

export default connect((state: ApplicationState) => state.foods, actionCreators)(Foods) as typeof Foods;
