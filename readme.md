# Tardigrade

Tardigrade is free lightweight zero-dependency javascript library for managing state and data with strict typing, supporting dynamic properties, property-specific, global and local listeners, and automatic cleanup for safe and flexible state control

## Why this library was created

This library was created to offer a simplified approach to state management with enhanced type safety, addressing some of the complexities and boilerplate often found in solutions like Redux. With this library, the goal was to create a lightweight state management tool that eliminates unnecessary configuration and ensures strict type control, while still being flexible enough to handle dynamic state changes and listeners

---

## Change log

There is ```changelog.md``` file, and you can easily check all changes that was added 

---

## Advantages of Tardigrade 

I've designed Tardigrade to offer a flexible, safe, and intuitive way to manage state in applications. Here's why this approach stands out:

### Ease of use

Minimal boilerplate code and a fairly straightforward API. Tardigrade provides a structured way to manage state, but with fewer steps. Tardigrade reduces the need for writing actions, reducers, and dispatchers, allowing developers to focus more on business logic.

### Full Dynamic State Control

Tardigrade allows you to dynamically add and remove properties, clone and merge stores and others, making it ideal for applications that need to modify their state structure on the fly. This flexibility is crucial for dynamic applications where data models evolve over time.

### Immutability

Tardigrade works with immutable data even if the provided data was originally mutable. It ensures that all state transformations maintain immutability, preventing unintended side effects and making state changes more predictable and reliable

### React friendly

Use Tardigrade with React.js

### Small size

Tardigrade had a small size


### Ease of async

With Tardigrade's resolvers you can easily store async or dynamic derived data

## Basic usage

#### Creating an Instance

To start using the library, first create an instance of it:

```ts
import { createTardigrade } from "tardigrade";

const tardigrade = createTardigrade();
```

####  Adding Properties

You can dynamically add properties to the state using the ```addProp``` method. Each property has a type that is locked once it is added.

```ts
tardigrade.addProp("counter", 0);  // Adds a property 'counter' with an initial value of 0
tardigrade.addProp("username", "guest");  // Adds a property 'username' with an initial value of 'guest'
```

#### Handle Properties

To update a property, use the ```setProp``` method. The new value must match the type of the property that was originally set:

```ts
tardigrade.setProp("counter", 5);  // Updates 'counter' to 5
tardigrade.setProp("username", "admin");  // Updates 'username' to 'admin'
```

You can also set a property to null without changing its type:

```ts
tardigrade.setProp("username", null);  // Sets 'username' to null, but its type remains string
```

#### Batch updates

To update several props at once use ```setProps```. All values are written first, then listeners are notified: each prop listener gets its new value, but global listeners are called **only once** per batch instead of once per change

```ts
tardigrade.setProps({
    counter: 5,
    username: "admin",
});
```

Global listener receives a batched update in a special form: array of changed names and a dictionary of changed values

```ts
tardigrade.addListener((name, value, props) => {
    if (Array.isArray(name)) {
        // batched update via setProps
        console.log("Changed props:", name, value);
        return;
    }

    console.log(`Prop ${name} changed to`, value);
});
```

Props that didn't actually change (same scalar value) are excluded from the batch, and if nothing changed listeners aren't called at all. Values are validated the same way as in ```setProp```: wrong types or unknown names are reported and skipped without breaking the rest of the batch

And if you need to get prop you can tackle it with ```prop``` method:

```ts
tardigrade.setProp("counter", tardigrade.prop("counter") + 1);
```

It is also possible to get all the props as simple object with getter ```props```

```ts
console.log(tardigrade.props); // will print all the props
```

To check was prop added use ```hasProp``` method

```ts
tardigrade.addProp("role", "customer");
console.log(tardigrade.hasProp("role")); // return true
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

If you need to remove all property-specific listeners at once, you can call ```removeAllPropListeners```:

```ts
tardigrade.removeAllPropListeners("counter");
```

#### Remove Global Listener

Similarly, you can remove global listeners with ```removeListener```:

```ts
tardigrade.removeListener(globalListener);
```

#### Remove All Global Listeners

If you need to remove all global listeners at once, you can call ```removeAllListeners```:

```ts
tardigrade.removeAllListeners();
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

You can also remove all the props by single hit with ```removeAllProps```. It is also remove all props listeners

```ts
tardigrade.removeAllProps();
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
tardigrade.merge(altStore, true);  // Will override existing props and listener handlers of this store after import
tardigrade.merge(altStore); // Won't override existing props and listener handlers of this store after import
````

Core kills merged store to keep single truth origin, but deactivated store after merging get link to ```mergeAgent``` - store which was merged and killed it. 
Also, it can be null if store is active

```ts
const currentStore = altStore.mergeAgent || altStore;
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

#### Getter ```isAlive(): boolean```

You can check activity of your store with ```isAlive``` getter

```ts
console.log(tardigrade.isAlive); // will print store state
```

#### Reset

In any moment you can reset your alive store to empty state. All props, resolvers, global and local listeners will be removed

```ts
tardigrade.reset();
```

---

## TypeScript typing

The store shape can be locked at compile time. Pass an interface (or just let TypeScript infer it from initial data) and props/resolvers become strictly typed: known prop names get autocomplete, values are type-checked, and resolver listeners receive the awaited return type of the resolver

```ts
const store = createTardigrade({
    counter: 0,
    username: "guest",
    double: ({ counter }: { counter: number }) => counter * 2,
});

store.setProp("counter", 5); // ok
store.setProp("counter", "text"); // compile error: string is not assignable to number

const counter = store.prop("counter"); // typed as Nullable<number>

store.addResolverListener("double", (value) => {
    // value is typed as Nullable<number>
});
```

You can also declare the shape explicitly without initial data:

```ts
interface StoreShape {
    counter: number;
    username: string;
}

const store = createTardigrade<StoreShape>();

store.addProp("counter", 0); // ok
store.addProp("counter", "text"); // compile error
```

Dynamic props keep working: any name that isn't declared in the shape falls back to ```any```, so nothing about the runtime flexibility is lost. And plain ```createTardigrade()``` without a shape behaves exactly as before

---

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

Resolver also migrate as well by merging and can be imported

You can also remove single resolver as well

```ts
tardigrade.removeResolver("multiplyMoneyRandomly");
```

Or you can drop all the resolvers by single hit

```ts
tardigrade.removeAllResolvers();
```

To check was resolver added use ```hasResolver``` method

```ts
tardigrade.addResolver("getUsers", async () => { /* ...some stuff */ });
console.log(tardigrade.hasProp("getUsers")); // return true
```

#### Usage with async

Also, you can use it with async function to do stuff like that

```ts
import { createTardigrade } from "./";

(async () => {
    const tardigrade = createTardigrade();

    const resolverKeys = {
        fetchSomeSpecial: "fetchSomeSpecial",
    };

    tardigrade.addResolver(resolverKeys.fetchSomeSpecial, async () => {
        try {
            const response = await fetch("https://jsonplaceholder.org/posts");
            return response.json();
        } catch (error) {
            console.log('Fetch error', error);
            return null;
            }
    });

    tardigrade.addResolverListener(resolverKeys.fetchSomeSpecial, (fetchedValue) => {
        console.log("Fetched value is", fetchedValue);
    });

    await tardigrade.callResolver(resolverKeys.fetchSomeSpecial);
})();
```

---

## ```createTardigrade``` variants

At the beginning we learn how create basic instance of store. But you are able to use some options to instancing

#### Initial props and resolvers

Pass json-friendly object as first argument. All what is function would become resolver and all other what is has another type would become prop 

```ts

import { createTardigrade } from "./";

(async () => {
    const propKeys = {
        counter: "counter",
    };

    const resolverKeys = {
        fetchSomeSpecial: "fetchSomeSpecial",
    };

    const tardigrade = createTardigrade({
        [propKeys.counter]: 0,
        [resolverKeys.fetchSomeSpecial]: async () => {
            try {
                const response = await fetch("https://jsonplaceholder.org/posts");
                    return response.json();
            } catch (error) {
                console.log('Fetch error', error);
                return null;
            }
        },
    });

    tardigrade.addPropListener(propKeys.counter, (counterValue) => {
        console.log(`Counter equals ${counterValue}`);
    });

    tardigrade.addResolverListener(resolverKeys.fetchSomeSpecial, (fetchedValue) => {
        console.log("Fetched value is", fetchedValue);
    });

    await tardigrade.callResolver(resolverKeys.fetchSomeSpecial);

    for (let i = 0; i < 10; i++) {
        tardigrade.setProp(propKeys.counter, tardigrade.prop(propKeys.counter) + 1);
    }
})();

```

#### Store initial options

With second argument you can pass some initialised options for store, for instance:

```ts
import { createTardigrade } from "./";

(async () => {
    const tardigrade = createTardigrade({
        "counter": 0,
    }, {
        emitErrors: true
    });

    tardigrade.setProp('text', "Lorem ipsum"); // bring real error
})();
```

There are several options:

```emitErrors: boolean``` - this options control how store react onto errors. If this prop equals true then store is going to crash after any incorrect usage. 
If false - you get only error-messages in console without real errors. By default, this initial prop equals false

```name: string | number | symbol``` - it is basically name of your store. It can be useful in case you want to get some store from array.
By default, name equals random uuid

```strictObjectsInterfaces``` - this parameter specifies how strictly to enforce type-checking on prop that has ```object``` type.
If the parameter equals ```true```, it's not possible to assign an object to a prop if its interface differs from the expected one

For instance

```ts
const propNames = {
    user: "user",
};

const store = createTardigrade({
    [propNames.user]: {
        name: "Alise", // will get string type
        age: 100, // will get number type
        data: null, // will get any type, you can write any type here later
    },
}, 
{
    strictObjectsInterfaces: true
});

store.addPropListener(propNames.user, value => console.log(value));

store.setProp(propNames.user, {
    name: "Bob",
    age: 200,
    data: Symbol("Bob")
});

store.setProp(propNames.user, {
    name: "Frank",
    age: "200",
}); // Bring error cause interface isn't the same

```

---

## React bridge

Tardigrade ships with a react bridge out of the box. It lives in a separate subpath export, so it doesn't affect bundle size or projects without react. React (>=16.8) is an optional peer dependency: install it only if you are going to use the bridge

```ts
import { TardigradeProvider, useTardigrade, useTardigradeProp } from "tardigrade-store/react";
```

#### ```useTardigrade(initialData?, initialOptions?)```

Creates a store bound to the component lifecycle. The store is created once on the first render and kept between re-renders

```tsx
import { useTardigrade, useTardigradeProp } from "tardigrade-store/react";

const Counter = () => {
    const store = useTardigrade({ counter: 0 });
    const [counter, setCounter] = useTardigradeProp<number>("counter", store);

    return <button onClick={() => setCounter(counter! + 1)}>{counter}</button>;
};
```

#### ```TardigradeProvider``` and shared stores

To share a single store across the component tree wrap it with the provider. All the bridge hooks look up the store from context when it isn't passed directly

```tsx
import { createTardigrade } from "tardigrade-store";
import { TardigradeProvider, useTardigradeProp } from "tardigrade-store/react";

const store = createTardigrade({ username: "guest" });

const UserBadge = () => {
    const [username] = useTardigradeProp<string>("username"); // taken from context
    return <span>{username}</span>;
};

const App = () => (
    <TardigradeProvider store={store}>
        <UserBadge />
    </TardigradeProvider>
);
```

#### ```useTardigradeProp<T>(name, store?)```

Subscribes the component to a single prop. Returns a tuple ```[value, setValue]``` similar to ```useState```. The component re-renders only when this prop changes

```tsx
const [counter, setCounter] = useTardigradeProp<number>("counter");

setCounter(5); // same as store.setProp("counter", 5)
```

#### ```useTardigradeProps(store?)```

Subscribes to all props at once and returns them as a plain object. The component re-renders on any store update

```tsx
const props = useTardigradeProps();
console.log(props.counter, props.username);
```

#### ```useTardigradeSelector<T>(selector, store?, isEqual?)```

Computes a derived value from props and re-renders the component **only when the result changes**. This is the middle ground between ```useTardigradeProp``` (one key) and ```useTardigradeProps``` (any change)

```tsx
const fullName = useTardigradeSelector((p) => `${p.firstName} ${p.lastName}`);
// changing an unrelated prop (e.g. theme) won't re-render this component

const userSlice = useTardigradeSelector((p) => ({ name: p.user?.name, role: p.user?.role }));
// content-equal slices keep the previous reference, safe for useEffect deps
```

By default results are compared the same way as object props in the bridge (content equality). You can pass a custom comparison as the third argument:

```tsx
const items = useTardigradeSelector((p) => p.items, store, (a, b) => a.length === b.length);
```

Inline selectors are fine — the hook keeps the selector in a ref, so no ```useCallback``` is required and the subscription is never re-created. Note that a new closure is applied on the next store update, not immediately on re-render

Selectors pair well with ```setProps```: a batch produces a single notification, so the selector recomputes once with the final values

#### ```useTardigradeResolver<T>(name, store?)```

Wires a resolver into the component. Returns a tuple ```[callResolver, lastValue]```. The last value updates every time the resolver is called — by this component or anywhere else in the app

```tsx
const [fetchPosts, posts] = useTardigradeResolver<Post[]>("fetchPosts");

useEffect(() => {
    fetchPosts();
}, [fetchPosts]);
```

#### ```useTardigradeStore(store?)```

Low-level hook used by the bridge itself. Returns the passed store or the one from the nearest ```TardigradeProvider```, and throws if neither exists. Useful to build custom hooks on top of the bridge

All the bridge hooks unsubscribe automatically on unmount, so there are no leaked listeners

#### Objects handling

The bridge keeps object props referentially stable: if an update brings an object with the same content, the component doesn't re-render and keeps the previous reference, so it's safe to use hook values in ```useEffect``` dependency arrays. Values stored in react state are always clones — mutating them never affects the store internals

---

## Persist

Tardigrade can persist props into a serializable storage (localStorage by default) via a separate subpath export. Zero dependencies, doesn't change the store model: persist reads ```store.props```, writes snapshots and restores props back through ```setProp``` / ```addProp```. Resolvers and listeners are never persisted

```ts
import { createTardigrade } from "tardigrade-store";
import { persist } from "tardigrade-store/persist";

const store = createTardigrade({ theme: "light", counter: 0 });

const link = persist(store, {
    key: "my-app",
    pick: (props) => ({ theme: props.theme }),
    saveAfter: 300,
});

store.setProp("theme", "dark"); // auto-saved 300ms later
```

#### How it works

Every save writes a full snapshot (not a delta) wrapped in an envelope ```{ version, data }```. Auto-save triggers on ```setProp```, ```setProps``` and ```addProp``` with a debounce (```saveAfter``` ms, ```0``` means synchronous). Resolver calls don't trigger writes. On start (```restoreOnStart```, default ```true```) the whole stored blob is merged back into the store: existing props via ```setProp```, unknown ones via ```addProp```

Important: ```pick``` applies **only on save**, restore always merges everything from storage. And since the core doesn't emit events on ```removeProp``` / ```reset```, call ```link.save()``` explicitly after them

#### PersistLink methods

```ts
link.save();      // write snapshot right now (works even on hold)
link.restore();   // read storage and merge into the store
link.forget();    // remove the key from storage, store untouched
link.peek();      // the snapshot that would be written, without writing

link.hold();      // suspend auto-save for bulk operations
link.unhold();    // resume auto-save and save once

link.retain("draft"); // allowlist for dynamic props (applied on top of pick)
link.drop("draft");
link.pick((props) => ({ theme: props.theme })); // replace pick at runtime

link.dispose();   // detach auto-save; explicit save/restore keep working
```

Bulk operations without extra writes:

```ts
link.hold();
store.addProp("a", 1);
store.removeProp("old");
link.unhold(); // single save with the final state
```

#### Migrations

Bump ```version``` and provide ```migrate``` to upgrade older snapshots:

```ts
persist(store, {
    key: "my-app",
    version: 2,
    migrate: (saved, fromVersion) => {
        if (fromVersion < 2) {
            const [firstName, lastName] = saved.fullName.split(" ");
            return { firstName, lastName };
        }
        return saved;
    },
});
```

#### Custom storage

Anything with ```read``` / ```write``` / ```remove``` works — the default is localStorage in browsers and an in-memory map elsewhere (SSR, tests):

```ts
import { PersistStorage, createInMemoryStorage } from "tardigrade-store/persist";

persist(store, { key: "my-app", storage: createInMemoryStorage() });
```

#### React

```tsx
import { usePersistedTardigrade } from "tardigrade-store/persist/react";

const Settings = () => {
    const link = usePersistedTardigrade({ theme: "light" }, { key: "settings" });
    // link.store is a regular Tardigrade store, use it with bridge hooks
};

// or with an existing store
const link = usePersistedTardigrade(store, { key: "settings" });
```

The hook creates the link once, restores on the client in an effect (SSR-safe) and detaches auto-save on unmount

---

## History (undo / redo)

Tardigrade can track props changes and roll them back via a separate subpath export. Zero dependencies, doesn't change the store model: history records snapshots of ```store.props``` and restores them back through ```setProp``` / ```addProp``` / ```removeProp```. Resolvers, listeners and merge lifecycle are never touched by undo/redo

```ts
import { createTardigrade } from "tardigrade-store";
import { history } from "tardigrade-store/history";

const store = createTardigrade({ counter: 0, title: "draft" });
const timeline = history(store, { limit: 100 });

store.setProp("counter", 1);
store.setProp("counter", 2);

timeline.undo(); // counter: 1
timeline.undo(); // counter: 0
timeline.redo(); // counter: 1
```

#### How it works

Every step is a full picked snapshot (not a delta). Auto-record triggers on ```setProp```, ```setProps``` and ```addProp```; a ```setProps``` batch is recorded as **one step**. Resolver calls don't create steps. Content-equal snapshots are skipped, so there are no duplicated steps. A new change after ```undo``` clears the redo branch (classic behavior). When ```limit``` (default 50) is exceeded, the oldest step is dropped

Undo/redo restores the store by diff without ```reset()```: missing keys are removed, existing ones are set, new ones are added — so dynamic props are fully supported. Since the core doesn't emit events on ```removeProp``` / ```reset``` / ```removeAllProps```, call ```timeline.record()``` explicitly after them (or wrap bulk work in ```hold``` / ```unhold```)

#### HistoryLink methods

```ts
timeline.undo();     // roll back one step, false if nothing to undo
timeline.redo();     // replay an undone step, false if nothing to redo
timeline.record();   // record current snapshot manually (after removeProp etc)

timeline.hold();     // suspend auto-record for bulk operations
timeline.unhold();   // resume auto-record and record a single step

timeline.clear();    // empty both stacks, store untouched
timeline.peek();     // current picked snapshot
timeline.peekUndo(); // snapshot the next undo() would restore, or null
timeline.peekRedo(); // snapshot the next redo() would restore, or null

timeline.canUndo;    // boolean
timeline.canRedo;    // boolean
timeline.isHeld;     // boolean

timeline.dispose();  // detach from the store, drop the stacks
```

Bulk operations as a single step:

```ts
timeline.hold();
store.addProp("field_email", "a@b.c");
store.addProp("field_phone", "+380");
timeline.unhold(); // one step with both fields

timeline.undo(); // both fields disappear
```

Merge as one logical operation:

```ts
timeline.hold();
host.merge(remote);
timeline.unhold();
```

After ```reset()``` start a fresh baseline:

```ts
store.reset();
timeline.clear(); // also re-attaches auto-record which reset() dropped
```

#### pick — keep ephemeral state out of history

Only picked props enter snapshots, and undo/redo touches **only** keys that were picked. Unpicked props (session tokens, UI state) are invisible to history and survive undo:

```ts
const timeline = history(store, {
    pick: (p) => ({ title: p.title, body: p.body }),
});

store.setProp("sidebarOpen", true); // not recorded, not restored
store.setProp("title", "New");      // recorded
```

#### History + persist together

Both layers subscribe to the same store and compose naturally:

```ts
const timeline = history(store);
const link = persist(store, { key: "editor" });

timeline.undo(); // restores props via setProp → persist auto-saves the restored state
```

Storage always follows the visible state, so after a reload the user continues from the last undone state. If you don't want persist restore to become an undoable step, attach persist **before** history (or call ```timeline.clear()``` after restore) — then the restored state is the history baseline

#### React

```tsx
import { useHistory } from "tardigrade-store/history/react";

const Toolbar = ({ store }) => {
    const timeline = useHistory(store);

    return (
        <>
            <button disabled={!timeline.canUndo} onClick={() => timeline.undo()}>Undo</button>
            <button disabled={!timeline.canRedo} onClick={() => timeline.redo()}>Redo</button>
        </>
    );
};
```

The hook creates the link once per store, re-renders the component when ```canUndo``` / ```canRedo``` flip and disposes on unmount. Prop values themselves re-render through the usual bridge hooks (```useTardigradeProp``` and others), since undo/redo restores props via regular ```setProp``` / ```addProp```

---

## Links

Github: [fimshagal/tardigrade](https://github.com/fimshagal/tardigrade)

E-mail: [fimashagal@gmail.com](mailto:fimashagal@gmail.com)

---

## Support

If you find this package useful, consider supporting my work via PayPal:

**fimashagal@gmail.com**


