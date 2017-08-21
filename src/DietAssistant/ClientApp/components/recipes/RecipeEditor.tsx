import * as React from 'react';
import * as _ from 'lodash';
import { IRecipe, IFood, IServing, INutrient, NutrientType, IIngredient, getRecipeNutrition, getRecipeServing, defaultNutritionUnit, changeServing, compareServings, getServingNameWithGrams, getRecipeServings } from '../../contracts';
import ServingsGrid from '../ServingsGrid';
import NutrientsGrid from '../NutrientsGrid';
import IngredientsGrid from '../IngredientsGrid';
import { dropdown } from '../EasyGrid';

interface RecipeEditorState {
    nutritionUnit?: IServing;
}

interface RecipeEditorProps {
    recipe: IRecipe;
    onChange: (this: void, recipe: IRecipe) => void;
}

export default class RecipeEditor extends React.Component<RecipeEditorProps, RecipeEditorState> {
    constructor(props) {
        super();

        this.state = { nutritionUnit: getRecipeServing(props.recipe) };
        this.handleSelectNutritionUnit = this.handleSelectNutritionUnit.bind(this);
        this.handleChangeServings = this.handleChangeServings.bind(this);
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
    }

    private handleSelectNutritionUnit(unit: IServing, selectedIndex: number) {
        this.setState({ nutritionUnit: unit });
    }

    private handleChangeServings(servings: IServing[]) {
        const nextRecipe = { ...this.props.recipe, servings };
        this.props.onChange(nextRecipe);
    }

    private handleChangeIngredients(ingredients: IIngredient[]) {
        const isRecipeServingSelected = compareServings(this.state.nutritionUnit, getRecipeServing(this.props.recipe));
        const nextRecipe = { ...this.props.recipe, ingredients };
        this.props.onChange(nextRecipe);
        if (isRecipeServingSelected) {
            this.handleSelectNutritionUnit(getRecipeServing(nextRecipe), 0);
        }
    }

    private handleChangeName(e) {
        const nextRecipe = { ...this.props.recipe, name: e.target.value };
        this.props.onChange(nextRecipe);
    }

    private getNutrients() {
        const nutrients = getRecipeNutrition(this.props.recipe).nutrients;
        const recipeServing = getRecipeServing(this.props.recipe);

        const result = this.state.nutritionUnit ?
            _.map(nutrients, (nutrient) => changeServing(nutrient, recipeServing, this.state.nutritionUnit)) :
            nutrients;

        return result;
    }

    private getServings() {
        return getRecipeServings(this.props.recipe);
    }

    public render() {
        // todo fix unavailableRecipeIds to analyze circular dependencies, not only direct
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="recipeName">Name</label>
                    <input type="text" className="form-control" id="recipeName" placeholder="Name" value={this.props.recipe.name} onChange={this.handleChangeName} />
                </div>
                <div className="form-group">
                    <label>Servings</label>
                    <ServingsGrid onChange={this.handleChangeServings} servings={this.props.recipe.servings} allowEmpty />
                </div>
                <div className="form-group">
                    <label>Ingredients</label>
                    <IngredientsGrid
                        unavailableFoodIds={_.map(this.props.recipe.ingredients, (ingredient) => ingredient.food && ingredient.food.id)}
                        unavailableRecipeIds={[this.props.recipe.id]}
                        ingredients={this.props.recipe.ingredients}
                        onChange={this.handleChangeIngredients}
                    />
                </div>
                <div className="form-group">
                    <label>Nutrients per</label>
                    <div>
                        {dropdown(
                            this.state.nutritionUnit,
                            _.map(this.getServings(), (serving, index) => ({ content: getServingNameWithGrams(serving), value: serving })),
                            this.handleSelectNutritionUnit,
                            '(select serving)',
                            compareServings
                        )}
                    </div>
                    <NutrientsGrid nutrients={this.getNutrients()} isReadOnly={true} />
                </div>
            </form>
        );
    }
}