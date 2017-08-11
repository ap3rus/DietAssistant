import * as React from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return (
            <div className='container-fluid'>
                <NavMenu />
                { this.props.children }
            </div>
        );
    }
}
