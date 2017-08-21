// todo refactor DayMealPlans and Recipes to remove code duplication
import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './dayMealPlansActions';
import { DayMealPlansState } from './dayMealPlansReducer';
import DayMealPlansGrid from './DayMealPlansGrid';
import { IDayMealPlan, Time } from '../../contracts';
import { withRouter } from 'react-router-dom'
import Page from '../Page';

type DayMealPlansProps =
    DayMealPlansState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class DayMealPlans extends React.Component<DayMealPlansProps, {}> {
    constructor() {
        super();

        this.handleCreateDayMealPlan = this.handleCreateDayMealPlan.bind(this);
        this.handleEditDayMealPlan = this.handleEditDayMealPlan.bind(this);
        this.handleRemoveDayMealPlan = this.handleRemoveDayMealPlan.bind(this);
    }

    handleCreateDayMealPlan() {
        const mealPlan = {
            name: '', meals: [
                { name: 'Breakfast', time: new Time(8, 0), foods: [] },
                { name: 'Lunch', time: new Time(12, 0), foods: [] },
                { name: 'Dinner', time: new Time(18, 30), foods: [] }
            ]
        };
        this.props.upsertDayMealPlan(mealPlan);
        this.props.history.push('/planning/edit');
    }

    handleEditDayMealPlan(dayMealPlan: IDayMealPlan) {
        this.props.setSelectedDayMealPlan(dayMealPlan);
        this.props.history.push('/planning/edit');
    }

    handleRemoveDayMealPlan(dayMealPlan: IDayMealPlan) {
        this.props.removeDayMealPlan(dayMealPlan);
    }

    public render() {
        return (
            <Page header="Day meal plans">
                <DayMealPlansGrid dayMealPlans={this.props.dayMealPlans} onCreate={this.handleCreateDayMealPlan} onRemove={this.handleRemoveDayMealPlan} onSelect={this.handleEditDayMealPlan} />
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.dayMealPlans, actionCreators)(withRouter(DayMealPlans)) as typeof DayMealPlans;
