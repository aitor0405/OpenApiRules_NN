import { createRulesetFunction } from '@stoplight/spectral-core';

const resultadoo = [];
function resolvedObject(objectKey, objectRequired){
  for(let i = 0; i < objectKey.length; i++){
    if(objectRequired === undefined || !objectRequired.includes(objectKey[i]) || objectRequired === null){
      resultadoo.push({
          message: `Propertie ${objectKey[i]} must be required because is a response property`,
        });
    }
  }
}
function resolvedOffs(input, context){
    let typeOfObject
    if (input['oneOf'] !== undefined) typeOfObject = 'oneOf'
    if (input['allOf'] !== undefined) typeOfObject = 'allOf'
    if (input['anyOf'] !== undefined) typeOfObject = 'anyOf'
    const objectsRef = Object.values(input[typeOfObject])
    for(let i = 0; i < objectsRef.length; i++){
      if(objectsRef[i].oneOf !== undefined || objectsRef[i].allOf !== undefined || objectsRef[i].anyOf !== undefined){
        resolvedOffs(objectsRef[i], context);
      } else if(objectsRef[i].type === 'object' && objectsRef[i].properties !== undefined){
        resolvedObject(Object.keys(objectsRef[i].properties), objectsRef[i].required)
      } else if(objectsRef[i].type === 'array' && objectsRef[i].items.type === 'object'){
        resolvedObject(Object.keys(objectsRef[i].items.properties), objectsRef[i].items.required)
      }
    }
}
function typeSchema(input, context){
  if(input.oneOf !== undefined || input.allOf !== undefined || input.anyOf !== undefined){
    resolvedOffs(input, context);

  }else if(input.type === 'object' && input.properties !== undefined){
    resolvedObject(Object.keys(input.properties), input.required)
  } else if(input.type === 'array' && input.items.type === 'object'){
      resolvedObject(Object.keys(input.items.properties), input.items.required)
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
  function responsePropertiesRequired(input, _, context) {
    resultadoo.splice(0,resultadoo.length)
    debugger;
    typeSchema(input, context);
    return resultadoo
  },
);