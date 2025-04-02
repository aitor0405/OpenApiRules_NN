import { createRulesetFunction } from '@stoplight/spectral-core';

export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  function validateContentType406(input, _, context) {
    const responses = input.responses;
    const response2xx = Object.keys(responses).filter(status => status.startsWith('2'));
    debugger

    let hasMultipleContentTypes = false;

    response2xx.forEach(status => {
      const contentTypes = Object.keys(responses[status].content || {});
      if (contentTypes.length > 1) {
        hasMultipleContentTypes = true;
      }
    });

    if (hasMultipleContentTypes) {
      if (!responses['406']) {
        return [{message: `Endpoint with multiple "content-types" in 2xx responses must define a "406" response.` }];
      }
    }
  }
);