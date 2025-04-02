import { createRulesetFunction } from '@stoplight/spectral-core';
const results = [];

function validatorObject(obj, con){
  const objectValues = Object.values(obj.properties)
  const objectKey = Object.keys(obj.properties)
  const objectRequired = obj.required
  let paramRequired = false
  for(let i = 0; i < objectValues.length; i++){
    if(objectRequired !== undefined && objectRequired.includes(objectKey[i])){ paramRequired = true}
    else{ paramRequired = false}
    switch (objectValues[i].type){
      case 'object':
        if(paramRequired && objectValues[i].nullable === true){
          results.push({
            message: `Property ${objectKey[i]} is Required & Nullable, change one of this`,
          });
        }
        break;
      case 'string':
      case 'array':
      case 'boolean':
      case 'integer':
      case 'number':
        if(paramRequired && objectValues[i].nullable === true){
          results.push({
            message: `Property ${objectKey[i]} is Required & Nullable, change one of this`,
          });
        }
        break;
    }
  }
}
export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // https://github.com/stoplightio/spectral/blob/develop/docs/guides/5-custom-functions.md#writing-functions
  function propertiesRequiredOrNullable(input, _, context) {
    debugger;
    results.splice(0,results.length)
    if(input.type === 'object' && input.properties !== undefined){
      validatorObject(input, context);
      return results
    }
  },
);