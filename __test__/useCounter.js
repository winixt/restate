import createShareStateHook from '../src/createShareStateHook';

const count = {
    state: {
        count: 0,
        name: '罗宾'
    },
    reducers: {
        increment: (state, payload) => Object.assign({}, state, {count: state.count + payload}),
        decrement: (state, payload) => Object.assign({}, state, {count: state.count - payload}),
        changeName: (state, payload) => Object.assign({}, state, {name: payload}),
    },
    effects: {
        async getDataAsync() {
            const result = await (new Promise((resolve, reject) => {
                fetch('/get').then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log(this);
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
            }));
            this.changeName(result.name);
        }
    }
};

export default createShareStateHook(count);

