import * as _ from 'lodash';

export function getNames(enumType: any): string[] {
    return _.chain(enumType)
        .keys()
        .filter(n => isNaN(parseInt(n, 10)))
        .value();
}

export function getValues(enumType: any): number[] {
    return _.chain(enumType)
        .keys()
        .filter(n => !isNaN(parseInt(n, 10)))
        .map(value => parseInt(value, 10))
        .value();
}

export function keyByValues(enumType: any): { [key: number]: string } {
    return _.chain(enumType)
        .keys()
        .filter(n => isNaN(parseInt(n, 10)))
        .keyBy(value => value)
        .mapKeys(value => enumType[value])
        .value();
}
