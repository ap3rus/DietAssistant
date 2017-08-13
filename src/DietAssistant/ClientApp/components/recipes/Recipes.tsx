import * as React from 'react';
import * as _ from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import { actionCreators } from './recipesActions';
import { RecipesState } from './recipesReducer';
import RecipesGrid from './RecipesGrid';
import { IRecipe } from '../../contracts';
import { withRouter } from 'react-router-dom'
import Page from '../Page';

type RecipesProps =
    RecipesState &
    typeof actionCreators &
    RouteComponentProps<{}>;

class Recipes extends React.Component<RecipesProps, {}> {
    constructor() {
        super();

        this.handleCreateRecipe = this.handleCreateRecipe.bind(this);
        this.handleEditRecipe = this.handleEditRecipe.bind(this);
        this.handleRemoveRecipe = this.handleRemoveRecipe.bind(this);
    }

    handleCreateRecipe() {
        const recipe = { name: '', notes: '', unit: null, servings: [], ingredients: [] };
        this.props.upsertRecipe(recipe);
        this.props.history.push('/recipes/edit');
    }

    handleEditRecipe(recipe: IRecipe) {
        this.props.setSelectedRecipe(recipe);
        this.props.history.push('/recipes/edit');
    }

    handleRemoveRecipe(recipe: IRecipe) {
        this.props.removeRecipe(recipe);
    }

    public render() {
        return (
            <Page header="Recipes">
                <RecipesGrid recipes={this.props.recipes} onCreate={this.handleCreateRecipe} onRemove={this.handleRemoveRecipe} onSelect={this.handleEditRecipe} />
            </Page>
        );
    }
}

export default connect((state: ApplicationState) => state.recipes, actionCreators)(withRouter(Recipes)) as typeof Recipes;
