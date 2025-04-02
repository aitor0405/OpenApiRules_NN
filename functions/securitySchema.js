import { createRulesetFunction } from '@stoplight/spectral-core';

export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // https://github.com/stoplightio/spectral/blob/develop/docs/guides/5-custom-functions.md#writing-functions
  function securitySchema(input, _, context) {
    // onst as1 = Object.keys(input.security.apiKeyHeader)
    // let as2 = input.security
    // let as3 = input.components.securitySchemes
    // let as4 = input.components.securitySchemes.apiKeyHeader
    debugger;
    if(input.info.title.toLowerCase().includes("mediation")){
      if(input.security === undefined || input.components.securitySchemes === undefined){
        return [{ message: `Security & component.securitySchemes is required for mediation apis`}]
      }else if (input.components.securitySchemes.apiKeyHeader === undefined || 
                input.components.securitySchemes.apiKeyQuery === undefined ){
        return [{ message: `apiKeyHeader & apiKeyQuery is required for component.securityScheme`}]
      }
    }else if(input.info.title.toLowerCase().includes("outer")){
      if (input.security === undefined || input.components.securitySchemes === undefined){
        return [{ message: `Security & component.securitySchemes is required for outer apis`}]
      }else if (input.components.securitySchemes.apiKeyHeader === undefined || 
                input.components.securitySchemes.apiKeyQuery === undefined ||
                input.components.securitySchemes.oAuth === undefined)
        return [{ message: `apiKeyHeader, apiKeyQuery & oAuth  is required for component.securityScheme`}]
    }
  },
);