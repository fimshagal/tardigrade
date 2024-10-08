# Tardigrade

![tardigrade.jpg](./tardigrade.jpg)

Tardigrade is lightweight javascript library for managing state and data with strict typing, supporting dynamic properties, property-specific, global and local listeners, and automatic cleanup for safe and flexible state control

---

## Attention!

Tardigrade still is under constructions

There is some known issue:
- bad import approach, you have to use direct file path instead an alias

## Why this library was created

This library was created to offer a simplified approach to state management with enhanced type safety, addressing some of the complexities and boilerplate often found in solutions like Redux. With this library, the goal was to create a lightweight state management tool that eliminates unnecessary configuration and ensures strict type control, while still being flexible enough to handle dynamic state changes and listeners

---

## Advantages of Tardigrade 

I've designed Tardigrade to offer a flexible, safe, and intuitive way to manage state in applications. Here's why this approach stands out:

### Ease of use

Minimal boilerplate code and a fairly straightforward API. Tardigrade provides a structured way to manage state, but with fewer steps. Tardigrade reduces the need for writing actions, reducers, and dispatchers, allowing developers to focus more on business logic.

### Full Dynamic State Control

Tardigrade allows you to dynamically add and remove properties, clone and merge stores and others, making it ideal for applications that need to modify their state structure on the fly. This flexibility is crucial for dynamic applications where data models evolve over time.

### Immutability

Tardigrade works with immutable data even if the provided data was originally mutable. It ensures that all state transformations maintain immutability, preventing unintended side effects and making state changes more predictable and reliable

### Small size

Tardigrade had a really small size


## Basic usage

#### Creating an Instance

To start using the library, first create an instance of it:

```ts
import { createTardigrade } from "tardigrade";

const tardigrade = createTardigrade();
```

####  Adding Properties

You can dynamically add properties to the state using the addProp method. Each property has a type that is locked once it is added.

```ts
tardigrade.addProp("counter", 0);  // Adds a property 'counter' with an initial value of 0
tardigrade.addProp("username", "guest");  // Adds a property 'username' with an initial value of 'guest'
```

#### Updating Properties

To update a property, use the ```setProp``` method. The new value must match the type of the property that was originally set:

```ts
tardigrade.setProp("counter", 5);  // Updates 'counter' to 5
tardigrade.setProp("username", "admin");  // Updates 'username' to 'admin'
```

You can also set a property to null without changing its type:

```ts
tardigrade.setProp("username", null);  // Sets 'username' to null, but its type remains string
```

#### Listening to Property Changes

There are two types of listeners you can add:

1. **Property-Specific Listeners:** These listen to changes on a specific property
2. **Global Listeners:** These listen to changes across all properties

#### Property-Specific Listener

To listen for changes on a specific property, use the ```addPropListener``` method:

```ts
const propListener = (value) => console.log("Counter changed to", value);
tardigrade.addPropListener("counter", propListener);
```

Whenever the counter property is updated, the ```propListener``` will be called with the new value

#### Global Listener

To listen for any change across all properties, use the addListener method:

```ts
const globalListener = (name, value, props) => {
    console.log('Global update');
    console.log(`Property ${name} changed to, ${value}`);
    console.log('All props', props);
};

tardigrade.addListener(globalListener);
```

This global listener is triggered whenever any property in the library is updated

#### Removing Listeners

Listeners can be removed to avoid memory leaks or when they are no longer needed

#### Remove Property-Specific Listener

To remove a specific listener for a property, use the ```removePropListener``` method:

```ts
tardigrade.removePropListener("counter", propListener);
```

#### Remove All Property-Specific Listeners

If you need to remove all property-specific listeners at once, you can call ```removeAllPropListener```:

```ts
tardigrade.removeAllPropListener("counter");
```

#### Remove Global Listener

Similarly, you can remove global listeners with ```removeListener```:

```ts
tardigrade.removeListener(globalListener);
```

#### Remove All Global Listeners

If you need to remove all global listeners at once, you can call ```removeAllListener```:

```ts
tardigrade.removeAllListener();
```

#### Removing Properties

You can dynamically remove properties using the ```removeProp``` method. This will also automatically remove all listeners attached to the property

```ts
tardigrade.removeProp("username");  // Removes 'username' property and its listeners
````
Once a property is removed, any attempt to update it will result in an error:

```ts
tardigrade.setProp("username", "newUser");  // Throws an error since 'username' was removed
```

#### Import props

You can import props of another Tardigrade store into your with ```merge``` method. This will automatically replace props from target store to that you need

```ts
const altStore = createTardigrade();
altStore.addProps("timestamp", 0);

tardigrade.importProps("altStore");  // Replaced "timestamp" prop into our base store
````

```importProps``` method replace only props, without prop's listener handlers

There are two ways to import props: without override or with

```ts
tardigrade.importProps("altStore", true);  // Will override existing props of this store after import
tardigrade.importProps("altStore"); // Won't override existing props of this store after import
````

#### Merge stores

You can merge one store into another. Merging replace not only props but all the listener handlers and make source object stop working

```ts
const altStore = createTardigrade();
altStore.addProps("timestamp", 0);
altStore.addPropListener("timestamp", (value) => console.log(value));

tardigrade.merge(altStore);  // Replaced "timestamp" prop and all the prop listener handlers

consolel.log(altStore.prop("timestamp")); // would return "null" cause altStore was killed after merging
````

As ```importProps``` this method also has two ways to be executed

```ts
tardigrade.merge("altStore", true);  // Will override existing props and listener handlers of this store after import
 tardigrade.merge("altStore"); // Won't override existing props and listener handlers of this store after import
````

#### Full Example

Here’s how you can combine everything:

```ts
import { createTardigrade } from "tardigrade";

const tardigrade = createTardigrade();

// Add properties
tardigrade.addProp("counter", 0);
tardigrade.addProp("username", "guest");

// Add listeners
const propListener = (value) => console.log("Counter changed to", value);
tardigrade.addPropListener("counter", propListener);

const globalListener = (name, value, props) => {
    console.log(`Global: ${name} changed to, ${value}`);
};

tardigrade.addListener(globalListener);

// Update properties
tardigrade.setProp("counter", 5);
tardigrade.setProp("username", "admin");

// Remove listeners
tardigrade.removePropListener("counter", propListener);
tardigrade.removeListener(globalListener);

// Remove a property
tardigrade.removeProp("username");
```

## Resolvers

Resolver - is a function which can be pass into store and be called in certain moment to bring some value. Application can follow resolvers as props to control state

#### Simple resolver usage

```ts
import { createTardigrade } from "tardigrade";

const tardigrade = createTardigrade();

tardigrade.addResolver("random", () => Math.random());
tardigrade.addResolverListener("random", (value) => {
   console.log(`Resolver was called and bring ${value}`); 
});

tardigrade.callResolver("random"); // as result it will call resolver listener handler above
```

Income resolver handler can use single argument - all the current props object

```ts
import { createTardigrade } from "tardigrade";

const tardigrade = createTardigrade();
tardigrade.addProp("money", 1e5);
tardigrade.addResolver("multiplyMoneyRandomly", ({ money }) => Math.random() * money);

tardigrade.addResolverListener("multiplyMoneyRandomly", (value) => {
   console.log(`Resolver was called and bring ${value}`); 
});

tardigrade.callResolver("multiplyMoneyRandomly");
```

Resolver also migrate as well by merging

---

## Links

Github: [fimshagal/tardigrade](https://github.com/fimshagal/tardigrade)

E-mail: [fimashagal@gmail.com](mailto:fimashagal@gmail.com)


