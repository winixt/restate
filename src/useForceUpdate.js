import {useCallback, useReducer} from 'react';

const reducer = (state) => !state;

function useForceUpdate() {
    const [ignore, dispatch] = useReducer(reducer, true);
    const memoizedDispatch = useCallback(
        () => {
            dispatch();
        },
        [ dispatch ]
      );
    return memoizedDispatch;
}

export default useForceUpdate;