import * as React from 'react';
import * as _ from 'lodash';

interface FieldDefinition<T> {
    header?: React.ReactNode;
    content: (this: void, row: T) => React.ReactNode;
    footer?: React.ReactNode;
}

interface EasyGridProps<T> {
    data: T[];
    fields: FieldDefinition<T>[];
    showHeader?: boolean;
    showFooter?: boolean;
}

export class EasyGrid<T> extends React.Component<EasyGridProps<T>, {}>{
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
                                        {field.content(row)}
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

//class PersonGrid extends EasyGrid<{ name: string, surname: string, children: { age: number, weight: number, name: string }[], favoriteKid: string}> { }

//function SomeComponent(props: any): JSX.Element {
//    const data = [
//        { name: 'test', surname: 'jopa', children: [{ age: 10, weight: 50, name: 'Karl' }, { age: 15, weight: 60, name: 'Klara' }], favoriteKid: 'Karl' }
//    ];
//    const fields = [
//        { header: 'Name', content: (item) => item.name },
//        { header: 'Full name', content: (item) => item.name + ' ' + item.surname },
//        { header: 'Children count', content: (item) => item.children.length },
//        { header: 'Favorit kid', content: (item) => {
//            return (
//                <select value={item.favoriteKid}>
//                    {_.map(item.children, (kid: { name: string, age: number }) => (
//                        <option value={kid.name}>{kid.name}, {kid.age} y.o.</option>
//                    ))}
//                </select>
//            );
//        }}
//    ];

//    return (
//        <PersonGrid
//            data={data}
//            fields={fields}
//        />
//    );
//}