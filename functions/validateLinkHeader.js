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
  function validateLinkHeader(input, _, context) {
    results.splice(0,results.length)
    debugger;
    if (input.Link === undefined){
      results.push({
        message: `The use of the Link header is recommended`,
      }); 
    }
    return results
  }
);