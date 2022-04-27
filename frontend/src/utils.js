import { v4 as uuidv4 } from 'uuid';

export const roundTwoDecimalPlaces = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const traverse = (data, keys, result = {}) => {
    for (let k of Object.keys(data)) {
        if (keys.includes(k)) {
            result = Object.assign({}, result, {
                [k]: data[k]
            });
            continue;
        }
        if (
            data[k] &&
            typeof data[k] === "object" &&
            Object.keys(data[k]).length > 0
        )
            result = traverse(data[k], keys, result);
    }
    return result;
}

export const getRandomInt = (min=0, max) => {
    return Math.floor(Math.random() * max) + min;
}

export const randomUUID = (version=4) =>{
    return uuidv4();
}

const getRandom = () => {
    const randomValue = Math.random();
    if (randomValue === 0) {
        return getRandom();
    }
    return randomValue;
};

const normalDistribution = () => {
    const u = getRandom();
    const v = getRandom();
    return Math.sqrt(-4.0 * Math.log(u)) * Math.cos(Math.PI * v);
};

export const dataGenerator = (pointCount) => {
    const data = [];
    for (let i = 0; i < pointCount; i += 1) {
        data.push({
            scatter_x_1: normalDistribution(),
            scatter_y_1: normalDistribution(),
            scatter_x_2: normalDistribution() + 3,
            scatter_y_2: normalDistribution() + 3,
            line_x_1: normalDistribution() - 6,
            line_y_1: normalDistribution() - 6,
        });
    }
    return data;
};
