export function mapObjectKeys(object) {
    return Object.keys(object).reduce(
        (acc, k) => ({
            ...acc,
            [object[k]]: k,
        }),
        {}
    );
}
