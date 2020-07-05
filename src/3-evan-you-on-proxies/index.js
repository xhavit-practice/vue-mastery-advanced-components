const originalData = { price: 5, quantity: 2 };
let total = 0;
let target = null;

function watcher(myFunc) {
    target = myFunc;
    target();
    target = null;
}

class Dep {
    constructor() {
        this.subscribers = [];
    }

    depend() {
        if (target && !this.subscribers.includes(target)) {
            this.subscribers.push(target);
        }
    }

    notify() {
        this.subscribers.forEach((sub) => sub());
    }
}

const deps = new Map();
Object.keys(originalData).forEach((key) => {
    deps.set(key, new Dep());
});

const data = new Proxy(originalData, {
    get(obj, key) {
        console.log('get', key);
        deps.get(key).depend();
        return obj[key];
    },
    set(obj, key, newVal) {
        console.log('set', key, newVal);
        obj[key] = newVal;
        deps.get(key).notify();
    },
});

watcher(() => {
    total = data.price * data.quantity;
});

console.log(total);
data.price = 20;
console.log(total);
data.quantity = 4;
console.log(total);

deps.set('discount', new Dep());
data.discount = 5;

let salePrice = 0;

watcher(() => {
    salePrice = data.price - data.discount;
});

console.log(`salePrice = ${salePrice}`);
data.discount = 7.5;
console.log(`salePrice = ${salePrice}`);
