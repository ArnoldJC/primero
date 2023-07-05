const {processEditJson} = require('./processEdiToJson');
const objects = require('./objects');

module.exports = {
    processEditJson,
    ...objects
};
