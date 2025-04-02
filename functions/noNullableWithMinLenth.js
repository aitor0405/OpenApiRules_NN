import { createRulesetFunction } from '@stoplight/spectral-core';

export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // https://github.com/stoplightio/spectral/blob/develop/docs/guides/5-custom-functions.md#writing-functions
  function noNullableWithMinLenth(input, _, context) {
    if((context.path[2] === "post" || context.path[2] === "put") && input.type === "string" && input.format === undefined && input.enum === undefined){
      if((input.nullable === undefined || input.nullable === false) && (input.minLength === undefined || input.minLength < 1) ){
        return [{ message: `The minLength parameter is required and += 1 for string properties with nullable false `}]
      }
    }

  },
);