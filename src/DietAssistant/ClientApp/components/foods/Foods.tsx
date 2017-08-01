import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './foodsActions';
import { FoodsState } from './foodsReducer';
import FoodsGrid from './FoodsGrid';
import { IFood } from '../../contracts';
import { withRouter } from 'react-router-dom'

type FoodsProps =
    FoodsState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class Foods extends React.Component<FoodsProps, {}> {
    constructor() {
        super();

        this.handleCreateFood = this.handleCreateFood.bind(this);
        this.handleRemoveFood = this.handleRemoveFood.bind(this);
    }

    handleCreateFood() {
        const food = { name: '', unit: null, servings: [], nutrients: [] };
        this.props.upsertFood(food);
        const history: { push: (this: void, url: string) => any } = this.props.history;
        history.push('/foods/edit');
    }

    handleRemoveFood(food: IFood) {
        this.props.removeFood(food);
    }

    public render() {
        return (
            <div>
                <FoodsGrid foods={this.props.foods} onCreate={this.handleCreateFood} onRemove={this.handleRemoveFood} />
            </div>
        );
    }
}

export default connect((state: ApplicationState) => state.foods, actionCreators)(withRouter(Foods)) as typeof Foods;
