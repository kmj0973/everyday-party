function processDataWithPatch(data) {
    for (let [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) {
            Reflect.deleteProperty(data, key);
        }
    }

    return data;
}

function processDataWithPut(originalData, newData) {
    for (let [key, value] of Object.entries(newData)) {
        if (value === undefined || value === null) {
            newData[key] = originalData[key];
        }
    }

    return newData;
}

module.exports = {
    processDataWithPatch,
    processDataWithPut,
};
