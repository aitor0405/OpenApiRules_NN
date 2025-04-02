import { isPlainObject, pointerToPath } from '@stoplight/json';
import { createRulesetFunction } from '@stoplight/spectral-core';
import { oas2, oas3_1, extractDraftVersion, oas3_0 } from '@stoplight/spectral-formats';
import { schema as schemaFn } from '@stoplight/spectral-functions';
import traverse from 'json-schema-traverse';
export default createRulesetFunction(
  {
    input: {
      type: "object"
    },
    options: null
  },
  function validateOperationIdFormat(endpoint, _, context) {
    /*
      Genera un operationId en correspondencia con el path empezando por el method, remplazando / por _ y remplazando xxxxId por_id
      ex: get /user/{userId}/policies/{policiesId}/customer ---> get_user_id_policies_id_customer
     */
    let id = context.path[2]+""+context.path[1]
    id = id.replace(/\//g, '_').replace(/{[A-Za-z_]*}/g, 'id').replace(/\.id/g, '_id')
    if (id != endpoint.operationId) {
      return [{ message: `Expected operationId to equal ${id}`}]
    }
  },
);