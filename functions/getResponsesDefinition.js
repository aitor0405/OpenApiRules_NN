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
  function getResponsesDefinition(input, _, context) {
    debugger;
    results.splice(0,results.length)
    const responsesStatus = Object.keys(input.responses)
    const succesResponsesStatus = responsesStatus.filter(a => a.startsWith('2'));
    const clientResponsesStatus = responsesStatus.filter(a => a.startsWith('4'));

    // Validamos si respuesta tiene los siguientes codigos de error, si no lanzamos error
    if (!['500', '404', '503'].every((clave) => responsesStatus.includes(clave))) {  
      results.push({
        message: `Required expected error codes: 400, 404, 500 & 503.`,
      });  
    }
    let operation = context.path[2]
    // GET solo puede contener 1 succesed response y tiene que ser 200, si viaja query param de tipo date será necesario 400 response
    if (operation.toLowerCase() === 'get'){
      if(input.hasOwnProperty('parameters')){
        for (let i = 0; i < input.parameters.length; i++) {  
          if (input.parameters[i].in === 'query' && input.parameters[i].schema.format?.toLowerCase().includes('date')){
            if(!clientResponsesStatus.includes('400')){
              results.push({
                message: `The GET method needs a 400 response code because it receives a date as a query parameter.`,
              });
            }
          } 
        }
      }
      if((succesResponsesStatus.length != 1 || !succesResponsesStatus.includes('200'))){
        results.push({
          message: `The GET method can only have 200 as a successful response code.`,
        });  
      }
      // PUT PATCH  Tiene que contener uno de estos 2 succesed response: 200 y 202 y a su vez el 400
    } else if(['patch', 'put'].includes(operation.toLowerCase()) || !clientResponsesStatus.includes('400')){
      if( !['200', '202','204'].some((clave) => succesResponsesStatus.includes(clave))){
        results.push({
          message: `The PATCH, PUT method can only have 200, 202 or 204 as a successful response code and 400 response is required.`,
        });  
      }
      // DELETE solo puede contener 1 succesed response y tiene que ser 202
    } else if(operation.toLowerCase() === 'delete'){
      if( !['200', '202','204'].some((clave) => succesResponsesStatus.includes(clave))){
        results.push({
          message: `The DELETE method can only have 200, 202 & 204 as a successful response code and 400 response is required.`,
        });  
      }
      // POST Tiene que contener uno de estos 3 succesed response: 200, 201, 204
    } else if (operation.toLowerCase() === 'post'){
      if( !['201', '204', '200'].some((clave) => succesResponsesStatus.includes(clave)) || !clientResponsesStatus.includes('400')){
        results.push({
          message: `The POST method can only have 200, 201 or 204 as a successful response code and 400 response is required.`,
        });  
      }
    }
    return results
  },
);