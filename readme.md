# Tardigrade

Tardigrade is lightweight javascript library for managing state and data with strict typing, supporting dynamic properties, property-specific, global and local listeners, and automatic cleanup for safe and flexible state control

---

## Why this library was created

This library was created to offer a simplified approach to state management with enhanced type safety, addressing some of the complexities and boilerplate often found in solutions like Redux. With this library, the goal was to create a lightweight state management tool that eliminates unnecessary configuration and ensures strict type control, while still being flexible enough to handle dynamic state changes and listeners

---

## Advantages of Tardigrade 

I've designed Tardigrade to offer a flexible, safe, and intuitive way to manage state in applications. Here's why this approach stands out:

### Strict Property Typing

Immutable Types: Once a property is added with a specific type, that type is locked. This guarantees that the type of the property cannot be changed later, ensuring consistency across your application.

Safe Handling of null Values: You can safely set a property to null without altering its original type. This allows you to clear values temporarily without losing the type information, ensuring that only null or the original type can be assigned to the property thereafter. This adds an extra layer of safety.


### Local and Global Listeners

Local Listeners: You can add listeners to individual properties via addPropListener, allowing you to react only to specific property changes. This reduces unnecessary processing and provides fine-grained control over state changes.

Global Listeners: Using addListener, you can globally listen for any property changes in the system. This is especially useful when you need to track or log all state modifications across multiple properties.


### Flexible Listener Management

Removing Specific Listeners: You can easily remove both local property listeners (via removePropListener) and global listeners (via removeListener), ensuring that you're not leaving unused listeners in memory. This helps prevent memory leaks and keeps the system clean.

Remove All Global Listeners: The optional removeAllListener() method provides a simple way to clear all global listeners at once, making it convenient to reset the state management system when necessary.


### Automatic Cleanup with Property Removal

Automatic Listener Cleanup: When you remove a property via removeProp, all listeners attached to that property are automatically removed as well. This ensures that the lifecycle of your data and listeners are tightly coupled, avoiding dangling listeners and potential memory issues.


### Dynamic State Control

This library allows you to dynamically add properties with addProp, making it ideal for applications that need to modify their state structure on the fly. This flexibility is crucial for dynamic applications where data models evolve over time.


### Error Reduction Through Strict Typing

With strict type checking, the library reduces the risk of runtime errors by ensuring that only the appropriate data types can be assigned to properties. The system will throw errors if you attempt to set a value of the wrong type, providing a robust safety net for managing your application state.


### Safe State Handling

Type-Safe Value Changes: After a property is added, the only allowable changes to its value must conform to its initial type. This prevents accidental type mismatches and keeps the application state consistent and reliable.


### Added Safety:

As mentioned, properties can be reset to null without affecting their original type. This maintains type integrity, ensuring that you can't accidentally overwrite a property with an incorrect data type while still allowing for safe "nullification" when needed.

---

## Base

Run this command to start demo sandbox
```shell
npm run dev
```

If you make some changes and want to check it you can call first
```shell
npm run build
```

and then check changes in sandbox

---

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
myLib.setProp("username", "newUser");  // Throws an error since 'username' was removed
```

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

