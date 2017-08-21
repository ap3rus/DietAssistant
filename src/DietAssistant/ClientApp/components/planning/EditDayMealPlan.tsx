import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './dayMealPlansActions';
import { DayMealPlansState } from './dayMealPlansReducer';
import { IDayMealPlan } from '../../contracts';
import DayMealPlanEditor from './DayMealPlanEditor';
import Page from '../Page';

type EditDayMealPlanProps =
    {
        selectedDayMealPlan: IDayMealPlan;
        index: number;
    } &
    DayMealPlansState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class EditDayMealPlan extends React.Component<EditDayMealPlanProps, {}> {
    constructor() {
        super();
        this.handleChangeDayMealPlan = this.handleChangeDayMealPlan.bind(this);
    }

    handleChangeDayMealPlan(nextDayMealPlan) {
        this.props.upsertDayMealPlan(nextDayMealPlan);
    }

    public render() {
        return (
            <Page header="Edit day meal plan">
                {this.props.selectedDayMealPlan && (
                    <DayMealPlanEditor dayMealPlan={this.props.selectedDayMealPlan} onChangeDayMealPlan={this.handleChangeDayMealPlan} />
                ) || "Oops, no day meal plan to edit, try going back."}
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.dayMealPlans, actionCreators)(EditDayMealPlan) as typeof EditDayMealPlan;
