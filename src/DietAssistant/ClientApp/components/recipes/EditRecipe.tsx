import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './recipesActions';
import { RecipesState } from './recipesReducer';
import { IRecipe } from '../../contracts';
import RecipeEditor from './RecipeEditor';
import Page from '../Page';

type EditRecipeProps =
    {
        selectedRecipe: IRecipe;
        index: number;
    } &
    RecipesState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class EditRecipe extends React.Component<EditRecipeProps, {}> {
    constructor() {
        super();
        this.handleChangeRecipe = this.handleChangeRecipe.bind(this);
    }

    handleChangeRecipe(nextRecipe) {
        this.props.upsertRecipe(nextRecipe);
    }

    public render() {
        return (
            <Page header="Edit recipe">
                {this.props.selectedRecipe && (
                    <RecipeEditor recipe={this.props.selectedRecipe} onChange={this.handleChangeRecipe} />
                ) || "Oops, no recipe to edit, try going back."}
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.recipes, actionCreators)(EditRecipe) as typeof EditRecipe;
