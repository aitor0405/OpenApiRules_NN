import { createRulesetFunction } from '@stoplight/spectral-core';

function checkNamesProperties(objectValues, responsesCode, input){
  // Function que valida que las propiedades de los objetos de respuesta estén definidos

  const objectValuesRequired = Object.values(input?.content?.["application/json"]?.schema?.required ?? {})

  if(responsesCode == "400"){
    const commonPropertiesNeeded = ["title","detail", "status", "instance", "type","errors"]
    const errorPropertiesNeeded= ["property", "details"]
    const errorsValues =  Object.keys(input?.content?.["application/json"]?.schema?.properties?.errors?.items?.properties ?? {});
    const errorsValuesRequired = Object.values(input?.content?.["application/json"]?.schema?.properties?.errors?.items?.required ?? {})
    // if que comprueba varias cosas, que viajen las propiedades definidas del objeto y las propiedades definidas del objeto errors,
    // que solo puedan viajar esas propiedades y niunguna mas y que todas esas propiedades sean required
    if( commonPropertiesNeeded.every(str => objectValues.includes(str)) && errorPropertiesNeeded.every(str => errorsValues.includes(str)) 
        && commonPropertiesNeeded.every(str => objectValuesRequired.includes(str)) && objectValues.length === commonPropertiesNeeded.length 
        && errorPropertiesNeeded.every(str => errorsValuesRequired.includes(str)) && errorsValues.length === errorPropertiesNeeded.length)
      return true
    else 
      return false
  } else if(responsesCode.startsWith('4')||responsesCode.startsWith('5')){
    const commonPropertiesNeeded = ["title","detail", "status", "instance", "type"]
    if(commonPropertiesNeeded.every(str => objectValues.includes(str)) && commonPropertiesNeeded.every(str => objectValuesRequired.includes(str)) 
      && objectValues.length === commonPropertiesNeeded.length)
      return true
    else 
      return false
  } else
      return true
}
function validateExamplesOnlyInProperties(input){
  const exampleInErrorCode = Object.keys(input?.content?.["application/json"]?.example ?? {})
  const examplesInErrorCode = Object.keys(input?.content?.["application/json"]?.example ?? {})
  const exampleInSchema = Object.keys(input?.content?.["application/json"]?.schema?.example ?? {})
  const examplesInSchema = Object.keys(input?.content?.["application/json"]?.schema?.examples ?? {})
  if(exampleInErrorCode.length > 0 || examplesInErrorCode.length > 0 || exampleInSchema.length > 0 || examplesInSchema.length > 0)
    return true
  else
    return false
}
export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  // https://github.com/stoplightio/spectral/blob/develop/docs/guides/5-custom-functions.md#writing-functions
  function commonErrorResponses(input, options, context) {
    debugger;
    //obtenemos valores propiedades.
    const objectValues = Object.keys(input?.content?.["application/json"]?.schema?.properties ?? {})
    const responsesCode = context.path[4]
    debugger;
      // const objectKey = Object.keys(input.content["application/json"].schema.properties)
    if(responsesCode.startsWith('4')||responsesCode.startsWith('5')){
      // si el error response no tiene propiedades definidas devolvemos error.
      if(objectValues.length == 0)
        return [{ message: `It is necessary to define the properties`}]
      // Los examples solo pueden estar definidos a nivel de propiedad
      // if(validateExamplesOnlyInProperties(input))
      //   return [{ message: `It is necessary to define the example ONLY in properties level.`}]
      const validateNameParameters = checkNamesProperties(objectValues, responsesCode, input)
      if (!validateNameParameters && responsesCode !== "400")
        return [{ message: `The properties 'title', 'detail', 'status', 'instance', and 'type' were expected to be defined, required, and no additional properties are allowed.`}]
      else if (!validateNameParameters && responsesCode === "400")
        return [{ message: `The properties 'title', 'detail', 'status', 'instance', errors[details, property], and 'type' were expected to be defined, required, and no additional properties are allowed.`}]
      // const titleExampleText = input?.content?.["application/json"]?.schema?.properties?.title?.example + ""
      // const statusExampleText = input?.content?.["application/json"]?.schema?.properties?.status?.example + ""
      // const typeExampleText = input?.content?.["application/json"]?.schema?.properties?.type?.example + ""
      // const detailExampleText = input?.content?.["application/json"]?.schema?.properties?.detail?.example + ""
      // switch(responsesCode){
      //   case "400":
      //     if(titleExampleText.trim() !== "Validation errors have occurred")
      //       return [{ message: `The title example is not equal to 'Validation errors have occurred'.`}]
      //     else if (statusExampleText.trim() !== "BadRequest")
      //       return [{ message: `The status example is not equal to 'BadRequest'.`}]
      //     else if (typeExampleText.trim() !== "VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'VALIDATION-ERROR'.`}]
      //     else if (detailExampleText.trim() !== "Invalid data entry, see errors parameter.")
      //       return [{ message: `The detail example is not equal to 'Invalid data entry, see errors parameter.'.`}]
      //     break;
      //   case "404":
      //     if(titleExampleText.trim() !== "The resource is not found")
      //       return [{ message: `The title example is not equal to 'The resource is not found'.`}]
      //     else if (statusExampleText.trim() !== "NotFound")
      //       return [{ message: `The status example is not equal to 'NotFound'.`}]
      //     else if (typeExampleText.trim() !== "VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'VALIDATION-ERROR'.`}]
      //     break;
      //   case "424":
      //     if(titleExampleText.trim() !== "Third party validation dependency")
      //       return [{ message: `The title example is not equal to 'Third party validation dependency'.`}]
      //     else if (statusExampleText.trim() !== "BadRequest")
      //       return [{ message: `The status example is not equal to 'BadRequest'.`}]
      //     else if (typeExampleText.trim() !== "BUSINESS-VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'BUSINESS-VALIDATION-ERROR'.`}]
      //     break;
      //   case "500":
      //     if(titleExampleText.trim() !== "Internal Server Error")
      //       return [{ message: `The title example is not equal to 'Internal Server Error'.`}]
      //     else if (statusExampleText.trim() !== "InternalServerError")
      //       return [{ message: `The status example is not equal to 'InternalServerError'.`}]
      //     else if (typeExampleText.trim() !== "VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'VALIDATION-ERROR'.`}]
      //     break;
      //   case "502":
      //     if(titleExampleText.trim() !== "Third party server error")
      //       return [{ message: `The title example is not equal to 'Third party server error'.`}]
      //     else if (statusExampleText.trim() !== "InternalServerError")
      //       return [{ message: `The status example is not equal to 'InternalServerError'.`}]
      //     else if (typeExampleText.trim() !== "BUSINESS-VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'BUSINESS-VALIDATION-ERROR'.`}]
      //     break;
      //   case "503":
      //     if(titleExampleText.trim() !== "The service is not available")
      //       return [{ message: `The title example is not equal to 'The service is not available'.`}]
      //     else if (statusExampleText.trim() !== "ServiceUnavailable")
      //       return [{ message: `The status example is not equal to 'ServiceUnavailable'.`}]
      //     else if (typeExampleText.trim() !== "VALIDATION-ERROR")
      //       return [{ message: `The type example is not equal to 'VALIDATION-ERROR'.`}]
      //     else if (detailExampleText.trim() !== "The server is not ready to handle the request.")
      //       return [{ message: `The detail example is not equal to 'The server is not ready to handle the request.'.`}]
      //     break;
      // }
    }
  }
);