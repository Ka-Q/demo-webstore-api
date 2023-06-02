const generateDeleteSQL = (table, req) => {
    let params = req.body;
    let keys = Object.keys(params);

    let query = "DELETE FROM " + table + " WHERE (1=1)";
    let queryList = [];

    for (let x in keys) {
        let key = keys[x];
        query += " AND ?? = ?";
        queryList.push(keys[x]);
        queryList.push(params[key]);
    }

    let returnJson = { params: params, keys: Object.keys(params), query: query, queryList: queryList };
    console.log(returnJson);
    return returnJson;
}

const generatePutSQL = (table, req) => {
    let params = req.body.data;
    let keys = Object.keys(params);

    let idParams = req.body.on;
    let idKeys = Object.keys(idParams);

    let query = "UPDATE " + table + " SET";
    let queryList = [];

    for (let x in keys) {
        let key = keys[x];
        query += " ?? = ?,";
        queryList.push(keys[x]);
        queryList.push(params[key]);
    }
    if (query.endsWith(',')) {
        query = query.substring(0, query.length - 1) + " WHERE (1=1)";
    }
    for (let x in idKeys) {
        let key = idKeys[x];
        query += " AND ?? = ?";
        queryList.push(idKeys[x]);
        queryList.push(idParams[key]);
    }

    let returnJson = { params: params, keys: Object.keys(params), query: query, queryList: queryList };
    console.log(returnJson);
    return returnJson;
}

const generatePostSQL = (table, req) => {
    let params = req.body;
    let keys = Object.keys(params);

    let query = "INSERT INTO " + table + "(";

    let queryList = [];
    let keyList = [];
    let valueList = [];

    let valueParams = "";

    for (let x in keys) {
        let key = keys[x];
        query += " ??,";
        valueParams += " ?,";
        keyList.push(keys[x]);
        valueList.push(params[key]);
    }
    if (valueParams.length > 0) {
        valueParams = valueParams.substring(0, valueParams.length - 1) + " )";
        query = query.substring(0, query.length - 1) + " ) VALUES (" + valueParams;
    }

    queryList = keyList.concat(valueList);

    let returnJson = { params: params, keys: Object.keys(params), query: query, queryList: queryList };
    console.log(returnJson);
    return returnJson;
}

const generateGetSQL = (table, req) => {
    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM " + table + " WHERE (1=1)";

    let queryList = [];

    for (let x in keys) {
        let key = keys[x];
        query += " AND ?? LIKE ?";
        queryList.push(keys[x]);
        queryList.push(params[key]);
    }

    let returnJson = { params: params, keys: Object.keys(params), query: query, queryList: queryList };
    console.log(returnJson);
    return returnJson;
}

exports.generateGetSQL = generateGetSQL;
exports.generatePostSQL = generatePostSQL;
exports.generatePutSQL = generatePutSQL;
exports.generateDeleteSQL = generateDeleteSQL;
