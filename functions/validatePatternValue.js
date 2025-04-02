import { createRulesetFunction } from '@stoplight/spectral-core';

export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // funcion que valida objetos SOLO cuando sean String format Date
  function validatePatternValue(input, _, context) {
    // verifica dos cosas, si el objeto no tiene pattern devuelve error indicandolo que lo necesita, si lo tiene; verifica que 
    // la cadena empiece por "^\\d{4}-\\d{2}-\\d{2}$" (2003-01-01)
    if(input['pattern'] === undefined){
      return [{ message: `The 'Pattern' property is mandatory for 'string' properties with 'date' format, and must start with  YAML -> ^\d{4}-\d{2}-\d{2}$ JSON -> ^\\d{4}-\\d{2}-\\d{2}$`}]
    } else if (!input['pattern'].startsWith("^\\d{4}-\\d{2}-\\d{2}$")){
      return [{ message: `This pattern does not start with YAML -> ^\d{4}-\d{2}-\d{2}$ JSON -> ^\\d{4}-\\d{2}-\\d{2}$`}]
    }
  },
);