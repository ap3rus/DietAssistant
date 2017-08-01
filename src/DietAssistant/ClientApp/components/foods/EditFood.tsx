import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './foodsActions';
import { FoodsState } from './foodsReducer';
import { IFood } from '../../contracts';
import FoodEditor from './FoodEditor';

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
            <div>
                {this.props.selectedFood && <FoodEditor food={this.props.selectedFood} onChangeFood={this.handleChangeFood}  />}
            </div>
        );
    }
}

export default connect((state: ApplicationState) => state.foods, actionCreators)(EditFood) as typeof EditFood;
