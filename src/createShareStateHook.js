import { useEffect } from 'react';
import globState from './defaultGlobalState';
import useForceUpdate from './useForceUpdate';

function createShareStateHook(initState) {
    return function () {
        const forceUpdate = useForceUpdate();
        const {state, reducers, effects} = globState.initShareState(initState);

        useEffect(() => {
            globState.addListener(initState, forceUpdate)
            return () => {
                globState.removeListener(initState, forceUpdate)
            }
        }, [forceUpdate]);
        return {
            state,
            reducers,
            effects
        };
    }
}

export default createShareStateHook;
