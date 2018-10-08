export default function(fn, delay) {
    let timer = null;

    return function(...args) {
        let context = this;

        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}
