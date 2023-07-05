const {x12Parser, x12SerializacionOptions} = require('node-x12');
const {constants, helpers, log} = require('utils-nxg-cg');
const {objectEdiToJson, optProps} = require('./objects');

/**
 * Method for convent edi File to json with format JSEdiNotation
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
            helpers.validProperties(extraProp, data, cfg, true);
            properties = {...properties, ...extraProp};
            properties.content = helpers.convertToUtf8(properties.content);
            const parser = new x12Parser(true); // APPLY FUNCTIONALITY
            const notation = parser.parse(properties.content, new x12SerializacionOptions(properties)).toJSEDINotation();
            if (helpers.isObjectValid({...notation})) { // VALIDATE IF IS A JSON
                log.info(constants.SUCCESS_TRANS);
                return notation;
            } else {
                throw Error(constants.ERROR_JSON_FORMAT);
            }
        }
    } catch (e) {
        log.error(e);
        throw Error(e);
    }
}