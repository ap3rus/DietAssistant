import * as React from 'react';
import * as _ from 'lodash';
import { Recipe, IFood, IServing, INutrient, NutrientType, IIngredient } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import IngredientsGrid from '../IngredientsGrid';

interface RecipeEditorProps {
    recipe: Recipe;
    onChange: (this: void, recipe: Recipe) => void;
}

export default class RecipeEditor extends React.Component<RecipeEditorProps, {}> {
    constructor() {
        super();
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleChangeUnit(e) {
        const nextUnit = this.props.recipe.servings[e.target.selectedIndex];
        const nextRecipe = new Recipe({ ...this.props.recipe, unit: nextUnit });
        this.props.onChange(nextRecipe);
    }

    handleChangeServings(servings: IServing[]) {
        const nextRecipe = new Recipe({ ...this.props.recipe, servings });
        if (!nextRecipe.unit && servings.length > 0) {
            nextRecipe.unit = servings[0];
        }
        this.props.onChange(nextRecipe);
    }

    handleChangeIngredients(ingredients: IIngredient[]) {
        const nextRecipe = new Recipe({ ...this.props.recipe, ingredients });
        this.props.onChange(nextRecipe);
    }

    handleCreateIngredient() {
        // todo 
    }

    handleChangeName(e) {
        const nextRecipe = new Recipe({ ...this.props.recipe, name: e.target.value });
        this.props.onChange(nextRecipe);
    }

    public render() {
        return (
            <div>
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
                    <select className="form-control" value={this.props.recipe.unit && this.props.recipe.unit.grams} onChange={this.handleChangeUnit}>
                        {_.map(this.props.recipe.servings, (serving, index) => (
                            <option key={index} value={serving.grams}>{serving.name} &ndash; {serving.grams}g</option>
                        ))}
                    </select>
                    <NutrientsGrid nutrients={this.props.recipe.nutrients} isReadOnly={true} />
                </div>
            </div>
        );
    }
}