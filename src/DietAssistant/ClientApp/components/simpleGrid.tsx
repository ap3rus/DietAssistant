import * as React from 'react';
import * as _ from 'lodash';

type FieldValuesType = { [id: number]: string } | ((this: void, row: any) => { [id: number]: string });

interface FieldDefinition {
    name: string;
    values?: FieldValuesType;
    updater?: (this: void, row: any, propertyName: string, value: any) => void;
    isReadOnly?: boolean;
}

type FieldType = string | FieldDefinition;

interface SimpleGridProps {
    data: Array<any>;
    fields: { [field: string]: FieldType };
    canCreate?: boolean;
    canRemove?: boolean;
    isReadOnly?: boolean;
    onChange?: (this: void, data: Array<any>) => void;
    onCreate?: (this: void) => void;
    cloneRow?: (this: void, row: any) => any;
}

export default class SimpleGrid extends React.Component<SimpleGridProps, {}> {
    public static defaultProps: Partial<SimpleGridProps> = {
        onChange: () => { },
        onCreate: () => { }
    };

    constructor() {
        super();
    }

    private handleRowFieldChange(rowIndex: number, propertyName: string, value: any, field: FieldType) {
        const nextRow = this.props.cloneRow ? this.props.cloneRow(this.props.data[rowIndex]) : { ...this.props.data[rowIndex] };
        const fieldUpdater = typeof (field) !== 'string' && field.updater ? field.updater : _.set;

        fieldUpdater(nextRow, propertyName, value);

        const nextData = [...this.props.data];
        nextData[rowIndex] = nextRow;

        this.props.onChange(nextData);
    }

    private handleRowRemove(rowIndex: number) {
        const nextData = [...this.props.data];
        nextData.splice(rowIndex, 1);

        this.props.onChange(nextData);
    }

    private renderField(rowIndex: number, propertyName: string, value: any, field: FieldType) {
        if (this.props.isReadOnly || typeof (field) !== 'string' && field.isReadOnly) {
            return value;
        } else if (typeof (field) !== 'string' && field.values) {
            const values = typeof (field.values) === 'function' ? field.values(this.props.data[rowIndex]) : field.values;

            return (
                <select className="form-control" value={value} onChange={(e) => this.handleRowFieldChange(rowIndex, propertyName, e.target.value, field)}>
                    {_.map(values, (name, value) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
            );
        } else {
            return (
                <input className="form-control" value={value} onChange={(e) => this.handleRowFieldChange(rowIndex, propertyName, e.target.value, field)} />
            );
        }
    }

    private getFieldName(propertyName) {
        const field = this.props.fields[propertyName];
        if (typeof (field) === 'string') {
            return field;
        } else {
            return field.name;
        }
    }

    public render() {
        const propertyNames = _.keys(this.props.fields);

        return (
            <div className="table-responsive">
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            {_.map(propertyNames, (propertyName, i) => (
                                <th key={i}>{this.getFieldName(propertyName)}</th>
                            ))}
                            {this.props.canRemove !== false && (
                                <th key="remove"></th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.props.data, (row, i) => (
                            <tr key={i}>
                                {_.map(propertyNames, (propertyName, j) => (
                                    <td key={j}>
                                        {this.renderField(i, propertyName, _.get(row, propertyName) as string, this.props.fields[propertyName])}
                                    </td>
                                ))}
                                {this.props.canRemove !== false && (
                                    <td key="remove">
                                        <a href="javascript:void(0)" onClick={(e) => this.handleRowRemove(i)}>X</a>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    {this.props.canCreate !== false && (
                        <tfoot>
                            <tr>
                                <td colSpan={propertyNames.length + 1}>
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