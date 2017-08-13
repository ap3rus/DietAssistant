import * as React from 'react';
import { NavMenu } from './NavMenu';
import AppInit from './AppInit';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <AppInit />
                <NavMenu />
                { this.props.children }
            </div>
        );
    }
}
