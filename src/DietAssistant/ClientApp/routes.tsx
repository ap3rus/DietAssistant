import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Foods from './components/foods/Foods';
import EditFood from './components/foods/EditFood';
import Recipes from './components/recipes/Recipes';
import EditRecipe from './components/recipes/EditRecipe';
import DayMealPlans from './components/planning/DayMealPlans';
import EditDayMealPlan from './components/planning/EditDayMealPlan';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/foods' component={Foods} />
    <Route exact path='/foods/edit' component={EditFood} />
    <Route exact path='/recipes' component={Recipes} />
    <Route exact path='/recipes/edit' component={EditRecipe} />
    <Route exact path='/planning' component={DayMealPlans} />
    <Route exact path='/planning/edit' component={EditDayMealPlan} />
</Layout>;
