import * as React from 'react';

interface SimpleGridProps {
    data: Array<any>;
    fields: { [field: string]: string };
    onChange: (this: void, data: Array<any>) => void;
    onCreate: (this: void) => void;
}

export default class SimpleGrid extends React.Component<SimpleGridProps, {}> {
    constructor() {
        super();
    }

    public componentWillReceiveProps() {
    }

    private handleRowFieldChange(index: number, fieldId: string, value: string) {
        const nextData = [...this.props.data];
        nextData[index] = { ...this.props.data[index], [fieldId]: value };

        this.props.onChange(nextData);
    }

    private handleRowRemove(index: number) {
        const nextData = [...this.props.data];
        nextData.splice(index, 1);

        this.props.onChange(nextData);
    }

    public render() {
        const fieldIds = Object.keys(this.props.fields);

        return (
            <div className="table-responsive">
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            {fieldIds.map((fieldId, key) => (
                                <th key={key}>{this.props.fields[fieldId]}</th>
                            ))}
                            <th key="remove"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((row, index) => (
                            <tr key={index}>
                                {fieldIds.map((fieldId, key) => (
                                    <td key={key}>
                                        <input className="form-control" value={row[fieldId]} onChange={(e) => this.handleRowFieldChange(index, fieldId, e.target.value)} />
                                    </td>
                                ))}
                                <td key="remove">
                                    <a href="javascript:void(0)" onClick={(e) => this.handleRowRemove(index)}>X</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={fieldIds.length + 1}>
                                <a href="javascript:void(0)" onClick={this.props.onCreate}>Add</a>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}