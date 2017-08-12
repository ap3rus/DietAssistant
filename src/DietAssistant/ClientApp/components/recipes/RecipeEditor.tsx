import * as React from 'react';
import * as _ from 'lodash';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient, getRecipeNutrition } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import IngredientsGrid from '../IngredientsGrid';
import { dropdown } from '../EasyGrid';

interface RecipeEditorProps {
    recipe: IRecipe;
    onChange: (this: void, recipe: IRecipe) => void;
}

export default class RecipeEditor extends React.Component<RecipeEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleChangeUnit(value, index) {
        const nextUnit = this.props.recipe.servings[index];
        const nextRecipe = { ...this.props.recipe, unit: nextUnit };
        this.props.onChange(nextRecipe);
    }

    handleChangeServings(servings: IServing[]) {
        const nextRecipe = { ...this.props.recipe, servings };
        if (!nextRecipe.unit && servings.length > 0) {
            nextRecipe.unit = servings[0];
        }
        this.props.onChange(nextRecipe);
    }

    handleChangeIngredients(ingredients: IIngredient[]) {
        const nextRecipe = { ...this.props.recipe, ingredients };
        this.props.onChange(nextRecipe);
    }

    handleCreateIngredient() {
        // todo 
    }

    handleChangeName(e) {
        const nextRecipe = { ...this.props.recipe, name: e.target.value };
        this.props.onChange(nextRecipe);
    }

    public render() {
        return (
            <form className="theme-alt">
                <div className="form-group">
                    <label htmlFor="recipeName">Name</label>
                    <input type="text" className="form-control" id="recipeName" placeholder="Name" value={this.props.recipe.name} onChange={this.handleChangeName} />
                </div>
                <div className="form-group">
                    <label>Servings</label>
                    <ServingsGrid onChange={this.handleChangeServings} servings={this.props.recipe.servings} />
                </div>
                <div className="form-group">
                    <label>Ingredients</label>
                    <IngredientsGrid ingredients={this.props.recipe.ingredients} onChange={this.handleChangeIngredients} onCreate={this.handleCreateIngredient} />
                </div>
                <div className="form-group">
                    <label>Nutrients per</label>
                    <div>
                        {dropdown(
                            _.get(this.props.recipe.unit, 'grams'),
                            _.map(this.props.recipe.servings, (serving, index) => ({ content: `${serving.name} - ${serving.grams}g`, value: serving.grams })),
                            this.handleChangeUnit,
                            '(select serving)'
                        )}
                    </div>
                    <NutrientsGrid nutrients={getRecipeNutrition(this.props.recipe).nutrients} isReadOnly={true} />
                </div>
            </form>
        );
    }
}