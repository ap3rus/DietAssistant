import * as React from 'react';

interface FieldDefinition {
    name: string;
    values?: { [id: number]: string };
}

type FieldType = string | FieldDefinition;

interface SimpleGridProps {
    data: Array<any>;
    fields: { [field: string]: FieldType };
    canCreate?: boolean;
    onChange: (this: void, data: Array<any>) => void;
    onCreate: (this: void) => void;
}

export default class SimpleGrid extends React.Component<SimpleGridProps, {}> {
    constructor() {
        super();
    }

    public componentWillReceiveProps() {
    }

    private handleRowFieldChange(rowIndex: number, fieldId: string, value: string) {
        const nextData = [...this.props.data];
        nextData[rowIndex] = { ...this.props.data[rowIndex], [fieldId]: value };

        this.props.onChange(nextData);
    }

    private handleRowRemove(rowIndex: number) {
        const nextData = [...this.props.data];
        nextData.splice(rowIndex, 1);

        this.props.onChange(nextData);
    }

    private renderField(rowIndex: number, fieldId: string, value: string, field: FieldType) {
        if (typeof (field) !== 'string' && field.values) {            
            return (
                <select className="form-control" value={value} onChange={(e) => this.handleRowFieldChange(rowIndex, fieldId, e.target.value)}>
                    {Object.keys(field.values).map((valueId, index) => (
                        <option key={index} value={valueId}>{field.values[valueId]}</option>
                    ))}
                </select>
            );
        } else {
            return (
                <input className="form-control" value={value} onChange={(e) => this.handleRowFieldChange(rowIndex, fieldId, e.target.value)} />
            );
        }
    }

    private getFieldName(fieldId) {
        const field = this.props.fields[fieldId];
        if (typeof (field) === 'string') {
            return field;
        } else {
            return field.name;
        }
    }

    public render() {
        const fieldIds = Object.keys(this.props.fields);

        return (
            <div className="table-responsive">
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            {fieldIds.map((fieldId, key) => (
                                <th key={key}>{this.getFieldName(fieldId)}</th>
                            ))}
                            <th key="remove"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((row, index) => (
                            <tr key={index}>
                                {fieldIds.map((fieldId, key) => (
                                    <td key={key}>
                                        {this.renderField(index, fieldId, row[fieldId], this.props.fields[fieldId])}
                                    </td>
                                ))}
                                <td key="remove">
                                    <a href="javascript:void(0)" onClick={(e) => this.handleRowRemove(index)}>X</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    {this.props.canCreate !== false && (
                        <tfoot>
                            <tr>
                                <td colSpan={fieldIds.length + 1}>
                                    <a href="javascript:void(0)" onClick={this.props.onCreate}>Add</a>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        );
    }
}