import * as React from 'react';
import * as _ from 'lodash';
import { IRecipe } from '../../contracts';
import EasyGrid, { createRowRemovalField, createRowCreationFooter } from '../EasyGrid';

class EasyGridWrapper extends EasyGrid<IRecipe> { }

interface RecipesGridProps {
    recipes: IRecipe[],
    onChange?: (this: void, recipes: IRecipe[]) => void;
    onUpdate?: (this: void, recipe: IRecipe) => void;
    onRemove?: (this: void, recipe: IRecipe) => void;
    onSelect?: (this: void, recipe: IRecipe) => void;
    onCreate?: (this: void) => void;
}

export default class RecipesGrid extends React.Component<RecipesGridProps, {}> {
    static defaultProps: Partial<RecipesGridProps> = {
        onChange: () => { },
        onUpdate: () => { },
        onRemove: () => { },
        onCreate: () => { }
    };

    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    private handleCreate() {
        this.props.onCreate();
    }

    private handleRemove(recipe: IRecipe, index: number) {
        const nextRecipes = [...this.props.recipes];
        nextRecipes.splice(index, 1);
        this.props.onChange(nextRecipes);
        this.props.onRemove(recipe);
    }

    private handleUpdate(recipe: IRecipe, index: number) {
        const nextRecipes = [...this.props.recipes];
        nextRecipes[index] = recipe;
        this.props.onChange(nextRecipes);
        this.props.onUpdate(recipe);
    }

    public render() {
        const data = this.props.recipes;
        const fields = [
            { header: 'Name', content: (row) => <a href="javascript:void(0)" onClick={(e) => this.props.onSelect(row)}>{row.name || '(no name)'}</a>, footer: createRowCreationFooter(this.handleCreate) },
            createRowRemovalField(this.handleRemove)
        ];

        return (
            <EasyGridWrapper fields={fields} data={data} showFooter />
        );
    };
}
