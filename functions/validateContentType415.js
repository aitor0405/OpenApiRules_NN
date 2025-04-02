import { createRulesetFunction } from '@stoplight/spectral-core';


export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  function validateContentType415(input, _, context) {
    debugger;
    if (input.requestBody && input.requestBody.content) {
      const contentTypes = Object.keys(input.requestBody.content);
      if (contentTypes.length > 1) {
        const responses = input.responses;
        
        if (!responses['415']) {
          return [{message: `Endpoint with multiple "content-types" in request must define a "415" response.`}]
        }
        // Si validamos el example obligo a que el example siempre viaje a nivel de content
        // else {
        //   const response406 = responses['406'];
        //   const expectedBody = {
        //     title: "Accept header is not supported",
        //     detail: "Only 'text/html' or 'application/json' content types supported.",
        //     status: "NotAcceptable",
        //     instance: context.path.join('/'),
        //     type: "VALIDATION-ERROR"
        //   };

        //   const actualBody = response406.content?.['application/json']?.example || {};

        //   if (JSON.stringify(expectedBody) !== JSON.stringify(actualBody)) {
        //     results.push({
        //       message: `The 406 response body does not match the expected structure.`,
        //     });
        //   }
        // }
      }
    }

  }
);