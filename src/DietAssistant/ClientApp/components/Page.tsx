import * as React from 'react';

interface PageProps {
    header: React.ReactNode;
}

export default class Page extends React.Component<PageProps, {}>{
    public render() {
        return (
            <div>
                <div className="page-header p-b-xxxs">
                    <div className="container">
                        <h1>{this.props.header}</h1>
                    </div>
                </div>
                <div className="container p-t-xs">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
