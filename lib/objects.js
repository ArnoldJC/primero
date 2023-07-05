/**
 * Extra property content
 * @type {{content : null}}
 */
const extraProp = {
    content : null
}

/**
 * Optional parameters with value
 * @type {{segmentTerminator : String, subElementDelimiter: String, elementDelimiter: string, endofLine: String, format: boolean}}
 */
const optProps = {
    elementDelimiter: "*",
    endofLine: '\n',
    format: true,
    segmentTerminator: '~',
    subElementDelimiter: '>'
}

/**
 * Object to Transform an edit file to json
 * @type {{content : null}}
 */
const ObjectEditToJson = {
    ...extraProp
}

/**
 * Object aditionals
 * @type {{functionalGroups: null, header: null}}
 */
const objectJsonEdit = {
    functionalGroups : null,
    header : null
};

/**
 * Object to transform an map json to json
 * @type {{mapping: null, content: null}}
 */
const objectMapJson = {
    ...extraProp,
    mapping: null
}

module.exports = {
    extraProp,
    ObjectEditToJson,
    objectJsonEdit,
    objectMapJson,
    optProps
}