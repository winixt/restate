export default class GlobalState {
    constructor() {
        this.reset();
    }

    initShareState(initState) {
        const _stateMap = this._stateMap;
        if (_stateMap.has(initState)) {
            const map = _stateMap.get(initState);
            return map.data;
        }
        const {state , reducers, effects} = initState;
        // 监听 state 的变化
        const proxyState = new Proxy({state}, {
            set(target, prop, value) {
                target[prop] = value;
                if (prop === 'state') {
                    for (let fn of _stateMap.get(initState).listeners.values()) {
                        fn();
                    }
                }
                return true;
            }
        })
        if (reducers) {
            proxyState.reducers = Object.keys(reducers).reduce((accumulate, key) => {
                accumulate[key] = function (payload) {
                    proxyState.state = reducers[key](proxyState.state, payload);
                }
                return accumulate;
            }, Object.create(null));
        }
    
        if (effects) {
            Object.keys(effects).forEach((key) => {
                effects[key] = effects[key].bind(proxyState.reducers);
            });
            proxyState.effects = effects;
        }
    
        _stateMap.set(initState, {
            data: proxyState,
            count: 0,
            listeners: new Map()
        });
        return proxyState;
    }

    addListener(stateId, listener) {
        if (this._stateMap.has(stateId)) {
            const map = this._stateMap.get(stateId);
            map.listeners.set(listener, listener)
            map.count++;
        }
    }

    removeListener(stateId, listener) {
        if (this._stateMap.has(stateId)) {
            const map = this._stateMap.get(stateId);
            map.listeners.delete(listener)
            map.count--;
            if (map.count === 0) {
                this._stateMap.delete(stateId);
            }
        }
    }

    reset() {
        this._stateMap = new Map();
    }
}