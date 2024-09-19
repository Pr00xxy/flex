<p align="center">
  <h1 align="center">✨ Flex ✨</h1>
  <p align="center">
    Javascript code as configuration
  </p>
</p>
<p align="center">
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/Pr00xxy/flex" alt="License"></a>
</p>

# Disclaimer
This repository is just a proof of concept, I give no guarantee of consistensy nor support should you attempt to use this. It's purely done for theoretical and academical purposes.

## Introduction

Flex, or "Flexible Expression Engine". I spent way too much time on the naming and it doesn't even make sense

It's a pretentiously named data mapper library made for typescript, mostly just a proof of concept.

Object conversion between systems is easy with code, harder with config.

Example of a rudimentary conversion logic could be as follows:
```ts
// 1. We have a source object
const sourceObj = {
    name: 'Alice',
    age: 30,
};

// 2. We have a target object
const targetObj = {
    fullName: '',
    yearsOld: undefined,
};

// 3. We have a mapping
const mappingConfig = {
    // source_field -> 'target_field'
    name: 'fullName',
    age: 'yearsOld',
};

// 4. We perform the mapping
for (const [sourceKey, targetKey] of Object.entries(mappingConfig)) {
    targetObj[targetKey] = sourceObj[sourceKey];
}

// 5. We have a mapped object
console.log(targetObj);
// { fullName: 'Alice', yearsOld: 30 }
```

Performing more complex conversions are impossible. Take the following example:
```ts
const sourceObj = {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
}

const targetObj = {
    fullName: '',
    yearsOld: '',
};
```

Maybe you might be inclined to implement some custom logic so that `firstName` + " " + `LastName` gets mapped to `fullName` on the target object.
This is however not possible in a couple of scenarios:
1. If, during runtime, the mapping should vary based on tenant/user
2. If the mapping needs to be changeable without code changes

## Solution

You've probably heard about configuration as code. The concept of storing a software configuration or infrastructure in a code repository such as git, version controlled and deployable along with your software.

Flex is that, but reversed, code stored as configuration.
Flex is a propriatary configuration language-ish thing allowing developers to run code stored in configuration data
fields in a secure way.

### Security
I think it's suitable to have this section first, as running unknown arbitrary strings as code is a no-no. So let me explain.

Flex does not use eval, nor does it actually execute arbitrary strings during runtime in an insecure way.
Flex utilizes [jsonpath](https://github.com/json-path/JsonPath) to locate object fields and a proprietary syntax to execute a set of predefined (or user defined) functions on the values that jsonpath locates.

Flex only parses a "function-like" syntax and tries to locate known functions from a predefined dictionary. Thus it can only execute known functions provided to it.

To ensure security, one may limit flex to only be able to execute functions of ones own making.

Flex is nothing more than a strategy pattern.

## Basic Usage

Flex exposes two apis, `flex()` and `flexSafe()`

`flex()` allows usage of the basic built in functions from this library
`flexSafe()` requires the user to provide their own functions, built in functions are disabled.
This is the recommended approach.

The following is the most basic usage of flex.
1. Function are prefixed with @, there must be one root function
2. Function arguments can be either literal strings, jsonpath or more nested functions
```ts
import { flex } from "@pr00xxy/flex"

const myObject = {
    foo: "hello",
    bar: "world",
};

const concatResult = flex("@concat(@space(), $.foo,$.bar)", testObject);
// concatResult = "hello world"
```

Now we understand the basic usage, lets go back and fix our original problem

```ts
const sourceObj = {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
}

const myMap = {
    fullName: "@concat(@space(), $.firstName, $.lastName)",
    yearsOld: "@concat(@space(), $.age, ' years old')"
}

const targetObj = {
    fullName: flex(myMap['fullName'], sourceObj),
    yearsOld: flex(myMap['fullName'], sourceObj),
};
// targetObj = { fullName: "Jane Doe", yearsOld: "30 years old" }
```
The mapping for `fullName` and `yearsOld` are now flex strings that can be safely stored in a database or configuration file for on demand use.

And as explained earlier, these strings are only interpretable by flex.
Flex strings are only executable by flex and no actual code is stored.

## Functions
The following is a list of the build in functions and their features

### @concat
concatenates all arguments into a string, delimited by the string passed as the first argument

```ts
const data = {
    field_1: "hello",
    field_2: "world",
};
const result = flex("@concat(@space(),$.field_1,$.field_2)", data);
// result = "hello world"
```

concat on multiple arrays unwpacks and concatenates all elements into a single string
```ts
const data = {
  field_1: ["hello", "world"],
  field_2: ["brown", "fox"],
};
const result = flex("@concat(@space(),$.field_1[*],$.field_2[*])", data);
// result = "hello world brown fox"
```

### @join
Join two arguments together to an array

Joining strings results in an array of said strings
```ts
const data = {
    field_1: "one",
    field_2: "two",
};
const result = flex("@join($.field_1, $.field_2)", data);
// result = ["one", "two"]
```
Joining two arrays results in a single array of all items
```ts
const data = {
  field_1: ["one", "two"],
  field_2: ["three", "four"],
};
const result = flex("@join($.field_1, $.field_2)", data);
// result = ["one", "two", "three", "four"]
```
Attempting to join two arrays will merge the arrays
```ts
const data = {
      field_1: ["one", "two"],
      field_2: ["three", "four"],
};
const result = flex("@join($.field_1, $.field_2)", data);
// result = ["one", "two", "three", "four"]
```
## @fallback
takes n number of arguments, returns the first key found
```ts
const data = {
  field_2: "world",
};
const result = flex("@fallback($.field_1,$.field_2)", fallbackObject);
// result = "world"
```