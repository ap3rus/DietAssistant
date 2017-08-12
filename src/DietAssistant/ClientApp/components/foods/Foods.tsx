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
import Page from '../Page';

type FoodsProps =
    FoodsState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class Foods extends React.Component<FoodsProps, {}> {
    constructor() {
        super();

        this.handleCreateFood = this.handleCreateFood.bind(this);
        this.handleEditFood = this.handleEditFood.bind(this);
        this.handleRemoveFood = this.handleRemoveFood.bind(this);
    }

    handleCreateFood() {
        const food = { name: '', unit: null, servings: [], nutrients: [] };
        this.props.upsertFood(food);
        this.props.history.push('/foods/edit');
    }

    handleEditFood(food: IFood) {
        this.props.setSelectedFood(food);
        this.props.history.push('/foods/edit');
    }

    handleRemoveFood(food: IFood) {
        this.props.removeFood(food);
    }

    public render() {
        return (
            <Page header="Foods">
                <FoodsGrid foods={this.props.foods} onCreate={this.handleCreateFood} onRemove={this.handleRemoveFood} onSelect={this.handleEditFood} />
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.foods, actionCreators)(withRouter(Foods)) as typeof Foods;
