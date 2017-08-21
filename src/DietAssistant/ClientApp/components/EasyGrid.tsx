import * as React from 'react';
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
                <table className="table table-striped">
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
        content: (row: T, index: number) => <a href="javascript:void(0)" onClick={(e) => onRemove(row, index)}><span className="glyph glyph-delete"></span></a>
    };
}

export function createDropdownField<T>(
    header: React.ReactNode,
    options: Array<{ value: any, content: React.ReactNode }> | ((this: void, row: T) => Array<{ value: any, content: React.ReactNode }>),
    getValue: (this: void, row: T) => any,
    setValue: (this: void, row: T, value: any) => T,
    handleUpdate: (this: void, row: T, index: number) => void,
    defaultContent: React.ReactNode,
    footer?: React.ReactNode) {

    return {
        header,
        content: (row, index) => dropdown(getValue(row), _.isFunction(options) ? options(row) : options, (value) => handleUpdate(setValue(row, value), index), defaultContent),
        footer
    };
}

export function createRowCreationFooter(onCreate: (this: void) => void) {
    return <a className="btn btn-primary" href="javascript:void(0)" onClick={onCreate}>Add</a>;
}

export function editable(value: any, onChange: (this: void, value: any) => void) {
    return <input className="form-control" value={value} onChange={(e) => { onChange(e.target.value); }} />
}

interface OptionType { value: any; content: React.ReactNode; disabled?: boolean }
interface OptionsGroupType { header: React.ReactNode; options: OptionType[] }

type OptionsType = OptionType[] | OptionsGroupType[];

export function dropdown(value: any, options: OptionsType, onChange: (this: void, value: any, index: number) => void, defaultContent: React.ReactNode, valueEqualityComparer?: (this: void, a: any, b: any) => boolean) {
    const allOptions = _.flatMap(options, (option: OptionType | OptionsGroupType) => _.isArray((option as OptionsGroupType).options) ? (option as OptionsGroupType).options : option as OptionType);

    const d2 = (
        <div className="dropdown">
            <button className="btn btn-dropdown dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                {_.get(_.find(allOptions, (option) => option.value === value || _.isFunction(valueEqualityComparer) && valueEqualityComparer(option.value, value)), 'content', defaultContent)}
                <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" role="menu">
                {_.map(options, (option: OptionType | OptionsGroupType, index: number) => {
                    const optionsToRender = _.isArray((option as OptionsGroupType).options) ? (option as OptionsGroupType).options : [option as OptionType];

                    if (optionsToRender.length == 0) {
                        return null;
                    }

                    const result = _.map(optionsToRender, option => option.disabled ? (
                        <li className="disabled"><a href="javascript:void(0)">{option.content}</a></li>
                    ): (
                        <li><a href="javascript:void(0)" onClick={onChange.bind(undefined, option.value, index)}>{option.content}</a></li>
                    ));

                    if ((option as OptionsGroupType).header) {
                        result.unshift(<li className="dropdown-header"><div className="p-l-xxs p-t-xxs">{(option as OptionsGroupType).header}</div></li>);
                    }

                    return result;
                })}
            </ul>
        </div>
    );

    return d2;
}
