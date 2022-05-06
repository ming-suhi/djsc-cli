/**
 * Converts an array to an object
 * @param array An array
 * @param key Object property to use as key
 */
export function arrayToObject<TType extends any[]>(array: TType, key: keyof TType[number]) {
  return array.reduce((acc,curr)=> (acc[curr[key]]=curr, acc), {});
}

/**
 * Get the reference of properties of an object that match condition
 * @param object An object
 * @param predicate A condition function
 */
export function* getPropertyReferences<TType>(object: TType, predicate: (value: any) => boolean) {
  yield* (function* generator(object: any, reference: string[]): Generator<any, any, any> {
    if(object == null) return;
    for(let [key, value] of Object.entries(object)) {
      if(predicate(value)) {
        yield [...reference.slice(), `${key}`]
      };
      if(value === Object(value)) {
        yield* generator(object[key], [...reference, `${key}`])
      };
    }
  }(object, []));
}

/**
 * Get the reference of all array properties
 * @param object An object
 */
export const getArrayPropertyReferences = (object: any) => getPropertyReferences(object, (value) => value instanceof Array);

/**
 * Get the reference of all blank properties
 * @param object An object
 */
export const getBlankPropertyReferences = (object: any) => getPropertyReferences(object, (value) => value == "" || (value instanceof Array || value === Object(value) && Object.keys(value as any).length == 0));

/**
 * Overwrite the value of a property
 * @param object An object
 * @param reference Reference to property
 * @param value A new value
 */
export function overwriteValueByReference(object: any, reference: string[], value: any) {
  const lastIndex = reference.length - 1;
  reference.reduce((acc, curr, currIndex) => {
    if(currIndex === lastIndex) {
      acc[curr] = value
    } else {
      return acc[curr]
    };
  }, object);
}

/**
 * Get the value of a property
 * @param object An object
 * @param reference A reference to a property
 */
export function getValueByReference(object: any, reference: string[]) {
  return reference.reduce((acc, curr) => acc[curr], object);
}

/**
 * Delete a property of an object
 * @param object An object
 * @param reference A reference to a property
 */
export function deletePropertyByReference(object: any, reference: string[]) {
  const lastIndex = reference.length - 1;
  reference.reduce((acc, curr, currIndex) => {
    if(currIndex === lastIndex) {
      delete acc[curr];
    } else {
      return acc[curr];
    }
  }, object);
}