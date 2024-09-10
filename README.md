# Flex

Or Flexible Expression Engine. I spent way too much time on the naming and it doesn't even make sense

## Introduction

It's what you get if you breed a programming language with a configuration language.
It's a pretentiously named complex data mapper library.

## Problem i tried solving

Mapping one object onto another based on a configuration is a simple task
Example of a rudimentary mapping logic could be as follows:
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
    // source_field: 'target_field'
    name: 'fullName',
    age: 'yearsOld',
};

// 4. We perform the mapping
for (const [sourceKey, targetKey] of Object.entries(mappingConfig)) {
    targetObj[targetKey] = sourceObj[sourceKey];
}

// 5. We have a mapped object
console.log(targetObj); // { fullName: 'Alice', yearsOld: 30 }
```

Performing more complex mapping are impossible. Take the following example:
```ts
const sourceObj = {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
}

const targetObj = {
    fullName: '',
    yearsOld: 0,
};
```

Due to the difference in data structure in how these objects handle the object names its impossible to perform a purely static mapping like the other example above.

In a normal scenarios you might be inclined to implement some custom logic so that `firstName` + " " + `LastName` gets mapped to `fullName` on the target object.
But if this mapping changes between tenants or users, it cannot be hardcoded, it must be dynamic

This is where `flex` comes into play.

## Solution

You've probably heard about configuration as code. The concept of storing a software configuration or infrastructure in a code repository such as git, version controlled and deployable along with your software.

Flex is that, but reversed, code stored as configuration.
Flex is a propriatary configuration language-ish thing allowing developers to run code stored in configuration data
fields in a secure way.

### Security
I think it's suitable to have this section first, as running unknown arbitrary strings as code is a nono. So let me explain.

Flex is not javascript nor does it execute arbitrary strings as code.
Flex utilizes [jsonpath](https://github.com/json-path/JsonPath) to locate object fields and a proprietary syntax to execute a set of predefined (or user defined) functions.

Flex only parses a "function-like" syntax and tries to locate known functions from a predefined dictionary. Thus it can only execute known functions provided to it.

For utmost security, one may limit flex to only be able to execute functions of ones own making.

Flex is nothing more than a strategy pattern.

## Basic Usage

Flex exposes two apis, `flex()` and `flexSafe()`

`flex()` allows usage of the basic built in functions from this library
`flexSafe()` requires the user to provide their own functions, built in functions are disabled. This is the recommended approach.

The following is the most basic usage of flex.
1. Function are prefixed with @, there must be one root function
2. Function arguments can be either literal strings, jsonpath or more nested functions
```ts
const myObject = {
    foo: "foo",
    bar: "bar",
};
const concatResult = flex("@concat(@space(), 'hello','world')", testObject);
// concatResult = "hello world"
```

Now we understand the basic usage, lets go back and fix our original problem

```ts
const sourceObj = {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
}

const targetObj = {
    fullName: flex("@concat(@space(), $.firstName, $.lastName)", sourceObj),
    yearsOld: sourceObj['age'],
};
// targetObj = { fullName: "Jane Doe", yearsOld: 30 }
```
The mapping for `fullName` is now a flex string that can be safely stored in a database or configuration table for on demand use.
Flex strings are only executable by flex and no actual code is stored.

## Functions
This section is WIP

### @concat

```ts
const myObject = {
    field_1: "hello",
    field_2: "world",
};
const result = flex("@concat(@space(),$.field_1,$.field_2)", myObject);
// result = "hello world"
```

### @join
join two arguments together to an array
```ts
const data = {
    field_1: "one",
    field_2: "two",
};
const query = "@join($.field_1, $.field_2)";
const result = flex(query, data);
// result = ["one", "two"]
```
Attempting to join two arrays will merge the arrays
```ts
const data = {
      field_1: ["one", "two"],
      field_2: ["three", "four"],
};
const query = "@join($.field_1, $.field_2)";
const result = flex(query, data);
// result = ["one", "two", "three", "four"]
```


