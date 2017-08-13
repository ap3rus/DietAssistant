import * as _ from 'lodash';

export interface IRepository<T> {
    getAll(): T[];
    get(id: string): T;
    save(id: string, item: T);
    remove(id: string);
}

export class LocalStorageRepository<T> implements IRepository<T> {
    constructor(public readonly namespace: string) {
    }

    private get prefix(): string {
        return this.namespace + '.';
    }

    public getAll(): T[] {
        return _.chain(localStorage)
            .keys()
            .filter((key) => _.startsWith(key, this.prefix))
            .map((key) => JSON.parse(localStorage.getItem(key)) as T)
            .value();
    }

    public get(id: string): T {
        const value = localStorage.getItem(this.prefix + id);
        if (!value) {
            return null;
        }

        return JSON.parse(value) as T;
    }

    public save(id: string, item: T) {
        localStorage.setItem(this.prefix + id, JSON.stringify(item));
    }

    public remove(id: string) {
        localStorage.removeItem(this.prefix + id);
    }
}
