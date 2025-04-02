import { createRulesetFunction } from '@stoplight/spectral-core';
const results = [];

export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // https://github.com/stoplightio/spectral/blob/develop/docs/guides/5-custom-functions.md#writing-functions
  function responseThirdPartyDefinition(input, _, context) {
    results.splice(0,results.length)
    const responsesStatus = Object.keys(input)
    const succesResponsesStatus = responsesStatus.filter(a => a.startsWith('2'));

    // Validamos si respuesta tiene los siguientes codigos de error, si no lanzamos error
    if (!['424', '502'].every((clave) => responsesStatus.includes(clave))) {  
      results.push({
        message: `ONLY for new API's. Required expected error codes: 424, 502.`,
      });  
    }
    return results
  }
);