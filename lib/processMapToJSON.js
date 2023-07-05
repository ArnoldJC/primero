const {x12Parser, x12SerializacionOptions, X12QueryEngine} = require('node-x12');
const {constants, helpers, log} = require('utils-nxg-cg');
const {objectEdiToJson, optProps} = require('./objects');

/**
 * Method for convent Json Map to JSON Map custom
 * @param msg
 * @param cfg
 * @param test
 * @returns {Promise Object}
 */
module.exports.proccessEdiToJson = async (msg, cfg, test = false) => {
    try {
        const {data} = msg;
        let properties = {...objectEdiToJson};
        let extraProp = {...optProps};
        if (!test && !data) {
            throw Error(`${constants.ERROR_PROPERTY} data`);
        }

        const valid = helpers.validProperties(properties, data, cfg); //VALIDATE IF DATA CONTAINS THE REQUIREMENTS NECESARY
        if (valid) { 
            if (!helpers.isObjectValid(properties.mapping))
                throw Error(constants.ERROR_JSON_FORMAT);
            properties.content = helpers.convertToUtf8(properties.content);
            const parser = new x12Parser();
            let interchange = parser.parse(properties.content);
            let r = {};
            interchange.functionalGroups.forEach(group => {
                group.transactions.forEach(transaction => {
                    r = transaction.toObject(properties.mapping);
                });
            });
            Object.keys(r).forEach(_value => {
                if (!r[_value]) {
                    const result = new X12QueryEngine().querySingle(interchange, properties.mapping[_value]);
                    if (result) {
                        const [value, values] = result;
                        if (values && values.length > 0)
                            r[_value] = values;
                        else if (value)
                            r[_value] = value;
                        else 
                            throw new Error(`Cannot get data ${r[_value]}`);
                    } else 
                        throw Error(`Cannot get data ${_value} with query ${properties.mapping[_value]}`);
                }
            });
            if (helpers.isObjectValid(r)) {
                log.info(constants.SUCCESS_TRANS);
                return r;
            } else 
                throw Error(constants.ERROR_JSON_FORMAT);
        }
    } catch (e) {
        log.error(e);
        throw Error(e);
    }
}