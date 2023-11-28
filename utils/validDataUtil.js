function processDataWithPatch(data) {
    const objects = Object.entries(data);
    for (let objIndex = 0; objIndex < objects.length; objIndex += 1) {
        if (objects[objIndex][1] === undefined || objects[objIndex][1] === null) {
            Reflect.deleteProperty(data, objects[objIndex][0]);
        }
    }

    return data;
}

function processDataWithPut(originalData, newData) {
    const objects = Object.entries(newData);
    const newDataWithPut = { ...newData };
    for (let objIndex = 0; objIndex < objects.length; objIndex += 1) {
        if (objects[objIndex][1] === undefined || objects[objIndex][1] === null) {
            newDataWithPut[objects[objIndex][0]] = originalData[objects[objIndex][0]];
        }
    }

    return newDataWithPut;
}

module.exports = {
    processDataWithPatch,
    processDataWithPut,
};
