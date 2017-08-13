import * as React from 'react';
import { connect } from 'react-redux';
import { actionCreators as foodsActionCreators } from './foods/foodsActions';
import { actionCreators as recipesActionCreators } from './recipes/recipesActions';

interface AppInitProps {
    loadFoodsFromRepository?: (this: void) => void;
    loadRecipesFromRepository?: (this: void) => void;
}

class AppInit extends React.Component<AppInitProps, {}> {
    static defaultProps: Partial<AppInitProps> = {
        loadFoodsFromRepository: () => { },
        loadRecipesFromRepository: () => { }
    }

    public componentDidMount() {
        this.props.loadFoodsFromRepository();
        this.props.loadRecipesFromRepository();
    }

    public render() {
        return null;
    }
}

export default connect(() => ({}), { loadFoodsFromRepository: foodsActionCreators.loadFoodsFromRepository, loadRecipesFromRepository: recipesActionCreators.loadRecipesFromRepository })(AppInit) as typeof AppInit;
