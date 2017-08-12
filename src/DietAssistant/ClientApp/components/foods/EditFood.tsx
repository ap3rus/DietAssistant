import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './foodsActions';
import { FoodsState } from './foodsReducer';
import { IFood } from '../../contracts';
import FoodEditor from './FoodEditor';
import Page from '../Page';

type EditFoodProps =
    {
        selectedFood: IFood;
        index: number;
    } &
    FoodsState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class EditFood extends React.Component<EditFoodProps, {}> {
    constructor() {
        super();
        this.handleChangeFood = this.handleChangeFood.bind(this);
    }

    handleChangeFood(nextFood) {
        this.props.upsertFood(nextFood);
    }

    public render() {
        return (
            <Page header="Edit food">
                {this.props.selectedFood && (
                    <FoodEditor food={this.props.selectedFood} onChangeFood={this.handleChangeFood} />
                ) || "Oops, no food to edit, try going back."}
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.foods, actionCreators)(EditFood) as typeof EditFood;
