﻿import * as React from 'react';
import * as _ from 'lodash';

export interface FieldDefinition<T> {
    header?: React.ReactNode;
    content: (this: void, row: T, index: number) => React.ReactNode;
    footer?: React.ReactNode;
}

interface EasyGridProps<T> {
    data: T[];
    fields: FieldDefinition<T>[];
    showHeader?: boolean;
    showFooter?: boolean;
}

export default class EasyGrid<T> extends React.Component<EasyGridProps<T>, {}>{
    static defaultProps: Partial<EasyGridProps<any>> = {
        showHeader: true,
        showFooter: false
    };

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-condensed">
                    {this.props.showHeader && (
                        <thead>
                            <tr>
                                {_.map(this.props.fields, (field, i) => (
                                    <th key={i}>{field.header}</th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {_.map(this.props.data, (row, i) => (
                            <tr key={i}>
                                {_.map(this.props.fields, (field, j) => (
                                    <td key={j}>
                                        {field.content(row, i)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    {this.props.showFooter && (
                        <tfoot>
                            <tr>
                                {_.map(this.props.fields, (field, i) => (
                                    <th key={i}>{field.footer}</th>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        );
    }
}

export function createEditableField<T>(
    header: React.ReactNode,
    getValue: (this: void, row: T) => any,
    setValue: (this: void, row: T, value: any) => T,
    handleUpdate: (this: void, row: T, index: number) => void,
    footer?: React.ReactNode) {

    return {
        header,
        content: (row, index) => editable(getValue(row), (value) => handleUpdate(setValue(row, value), index)),
        footer
    };
}

export function createRowRemovalField<T>(onRemove: (this: void, row: T, index: number) => void) {
    return {
        header: '',
        content: (row: T, index: number) => <a href="javascript:void(0)" onClick={(e) => onRemove(row, index)}>X</a>
    };
}

export function createDropdownField<T>(
    header: React.ReactNode,
    options: Array<{ value: any, content: React.ReactNode }> | ((this: void, row: T) => Array<{ value: any, content: React.ReactNode }>),
    getValue: (this: void, row: T) => any,
    setValue: (this: void, row: T, value: any) => T,
    handleUpdate: (this: void, row: T, index: number) => void,
    footer?: React.ReactNode) {

    return {
        header,
        content: (row, index) => dropdown(getValue(row), _.isFunction(options) ? options(row) : options, (value) => handleUpdate(setValue(row, value), index)),
        footer
    };
}

export function createRowCreationFooter(onCreate: (this: void) => void) {
    return <a href="javascript:void(0)" onClick={onCreate}>Add</a>;
}

export function editable(value: any, onChange: (this: void, value: any) => void) {
    return <input className="form-control" value={value} onChange={(e) => { onChange(e.target.value); }} />
}

export function dropdown(value: any, options: Array<{ value: any, content: React.ReactNode }>, onChange: (this: void, value: any) => void) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {_.map(options, (option: { value: any, content: React.ReactNode }) => (
                <option value={option.value}>{option.content}</option>
            ))}
        </select>
    );
}