import { createRulesetFunction } from '@stoplight/spectral-core';
const results = [];


export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  function validateSummariesNotEqual(input, _, context) {
    results.splice(0,results.length)

    const responsesStatus = Object.keys(input)
    for(let i = 0; i < responsesStatus.length; i++){
      let path = input[responsesStatus[i]]
      let pathProperties = Object.keys(path)
      let pathPropertiesOperations = pathProperties.filter(a => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(a.toUpperCase()));
      for(let e = 0; e < pathPropertiesOperations.length; e++){
        let summaries =  input[responsesStatus[i]][pathPropertiesOperations[e]].summary
        if (!results.includes(summaries)) {
          results.push(summaries);
        }else{
          return [{ message: `Duplicate summary: ${summaries}`}]
        }
      }
    }
  },
);