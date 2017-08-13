import * as React from 'react';
import { NavMenu } from './NavMenu';
import AppInit from './AppInit';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <NavMenu />
                { this.props.children }
                <AppInit />
            </div>
        );
    }
}
