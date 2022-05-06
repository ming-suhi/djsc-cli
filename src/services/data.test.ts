import { arrayToObject, getValueByReference, getArrayPropertyReferences, getBlankPropertyReferences, overwriteValueByReference, deletePropertyByReference } from "./data";
import * as _ from "lodash";

it("should array to object", () => {
  const sample = [
    {name: "personA", id: 1}, 
    {name: "personB", id: 2}
  ];
  expect(arrayToObject(sample, "name")).toEqual({
    "personA": {name: "personA", id: 1}, 
    "personB": {name: "personB", id: 2}
  });
});

it("should overwrite property value", () => {
  const sample = {
    personA: {
      jobs: { count: 5 }
    }
  };
  const reference = getValueByReference(sample, ["personA", "jobs", "count"]);
  expect(reference).toEqual(5);
  overwriteValueByReference(sample, ["personA", "jobs", "count"], 10)
  expect(sample.personA.jobs.count).toEqual(10);
});

it("should get property references", () => {
  const sample = {
    personA: {
      jobs: [
        {
          name: "student",
          days: ["M", "T"]
        },
        {
          name: "tambay",
          days: ["M", "T", "W"]
        }
      ],
      pronouns: ["he", "him"]
    }
  };
  expect(Array.from(getArrayPropertyReferences(sample))).toEqual([
    ["personA", "jobs"],
    ["personA", "jobs", "0", "days"],
    ["personA", "jobs", "1", "days"],
    ["personA", "pronouns"]
  ]);
});

it("should delete blank properties", () => {
  const sample = {
    options: [],
    choices: {
      choiceA: []
    }
  };
  for(let reference of getBlankPropertyReferences(sample)) {
    deletePropertyByReference(sample, reference);
  }
  expect(sample).toEqual({
    choices: {}
  });
});