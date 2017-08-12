import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Foods from './components/foods/Foods';
import EditFood from './components/foods/EditFood';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route exact path='/foods' component={Foods} />
    <Route exact path='/foods/edit' component={EditFood} />
</Layout>;
