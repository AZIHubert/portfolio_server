const normalizeSorting = sort => {
    if(!sort) return {}
    const sorting = {};
    sort.forEach(s => {
        sorting[s.field] = s.order
    });
    return sorting;
};

const filterField = (value) => {
    const filter = {}
    if(typeof value !== "object") return value
    for(const [subKey, subValue] of Object.entries(value)){
        filter[`$${subKey}`] = subValue;
    }
    return filter;
}

const normalizeFilter = filter => {
    if(!filter) return {};
    const filtering = {};
    for(const [key, value] of Object.entries(filter)){
        if(key !== 'and' && key !== 'or' && key !== 'not') {
            filtering[key] = filterField(value);
        } else {
            let newValue = {}
            newValue = value.map(value => {
                const subFilter = {};
                for(const [key2, value2] of Object.entries(value)){
                    subFilter[key2] = filterField(value2);
                }
                return subFilter
            });
            filtering[`$${key}`] = newValue;
        }
    }
    return filtering;
}

module.exports.normalizeSorting = normalizeSorting;
module.exports.normalizeFilter = normalizeFilter;