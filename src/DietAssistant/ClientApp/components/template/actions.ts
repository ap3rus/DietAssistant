import * as _ from 'lodash';
import { AppThunkAction } from '../../store';

type FooType = 'foo';

export const FOO: FooType = 'foo';

interface FooAction { type: FooType, bar: string }

export type KnownAction = FooAction;

export const actionCreators = {
    foo: (bar: string) => <FooAction>{ type: FOO, bar },
    multiFoo: (bars: string[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        _.forEach(bars, bar => dispatch(actionCreators.foo(bar)));
    }
};