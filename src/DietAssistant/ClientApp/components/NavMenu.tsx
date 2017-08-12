import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <nav className="navbar navbar-default">
                <div className="navbar-global color-accent theme-dark">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <i className="glyph glyph-hamburger"></i>
                            </button>

                            <Link className='navbar-brand' to={'/'}>Diet Assistant</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="main-navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <NavLink exact to={'/'} activeClassName='active'>
                                        <span className='glyph glyph-home'></span> Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/foods'} activeClassName='active'>
                                        <span className='glyph glyph-shopping-cart'></span> Foods
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/recipes'} activeClassName='active'>
                                        <span className='glyph glyph-list'></span> Recipes
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/planning'} activeClassName='active'>
                                        <span className='glyph glyph-calculator'></span> Planning
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/diary'} activeClassName='active'>
                                        <span className='glyph glyph-calendar'></span> Diary
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
