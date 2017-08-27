import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={ '/' }>DietAssistant</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink exact to={ '/' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/foods' } activeClassName='active'>
                                <span className='glyphicon glyphicon-apple'></span> Foods
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/recipes'} activeClassName='active'>
                                <span className='glyphicon glyphicon-cutlery'></span> Recipes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/planning'} activeClassName='active'>
                                <span className='glyphicon glyphicon-tasks'></span> Planning
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/diary'} activeClassName='active'>
                                <span className='glyphicon glyphicon-calendar'></span> Diary
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}
