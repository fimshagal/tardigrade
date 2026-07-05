# Changelog

## [1.1.6] - 2024-10-09
### Added
- Async resolvers and import resolvers
 
### Updated
- docs

---

## [1.1.7] - 2024-10-09
### Updated
- license to CC BY 4.0
- docs

---

## [1.1.8] - 2024-10-09
### Added
- License banner

### Fixed
- ```addResolver``` and ```setResolver``` function filter

### Updated
- types and interfaces
- ```createTardigrade``` method
- docs

---

## [1.1.9] - 2024-10-10
### Added
- Store getter: ```isAlive```
- Store getter: ```mergeAgent```
- Basic logic to pass store's initial options
- Add store's initial options ```emitErrors```

### Fixed
- Bunch of typos

### Updated
- error handling
- docs
- errors messages

---

## [1.1.10] - 2024-10-10
### Added
- Methods: ```reset```, ```removeAllProps```, ```removeAllResolvers```

### Updated
- Method ```kill```
- docs

---

## [1.1.11] - 2024-10-10
### Added
- Prop and options item ```name```

### Fixed
- Method ```setProp```

### Updated
- docs

---

## [1.1.12] - 2024-10-10
### Added
- Prop and option's item ```strictObjectsInterfaces``` and some logic to tackle this state

### Updated
- Public methods ```setProp``` and semi-public ```silentSetProp``` and ```silentAddProp```
- docs

---

## [1.1.13] - 2024-10-10
### Added
- Special optimisation to skip same income value

### Updated
- docs

---

## [1.1.14] - 2024-10-11
### Added
- Build preprocessing 
- Method ```callResolversChain```

### Updated
- docs

---

## [1.1.15] - 2024-10-11
### Updated
- docs

---

## [1.1.16] - 2024-10-11
### Updated
- docs

---

## [1.1.17] - 2024-10-11
### Removed
- resolvers chains

### Updated
- docs

---

## [1.1.18] - 2024-10-11
### Updated
- added logic to prevent write function as prop

---

## [1.1.19] - 2024-10-11
### Fixed
- import approach: added index file to export es module

### Updated
-docs

---

## [1.1.20] - 2024-10-11
### Fixed
- import approach: polished

### Updated
-docs

---

## [1.1.21-1.1.23] - 2024-10-11
### Tidy

---

## [1.1.24] - 2024-10-11
### Added
- method ```hasProp```
- method ```hasResolver```
- tests (check Github)

### Updated
- docs

---

## [1.2.0] - 2026-07-04
### Added
- strict TypeScript typing: ```createTardigrade<Shape>()``` and shape inference from initial data; ```prop```, ```setProp```, ```addProp```, prop and resolver listeners are typed by store shape, dynamic props fall back to ```any```
- ```typecheck``` npm script (tsc over sources and tests, validates ```@ts-expect-error``` assertions)
- React bridge out of the box: subpath export ```tardigrade-store/react```
- ```useTardigrade``` hook to create component-scoped store
- ```useTardigradeProp``` hook to subscribe to single prop
- ```useTardigradeProps``` hook to subscribe to all props
- ```useTardigradeResolver``` hook to call resolver and read its value
- ```TardigradeProvider``` and ```useTardigradeStore``` to share store via react context
- ```react``` as optional peer dependency
- referential stability for object props in react bridge: content-equal updates don't cause re-renders, react state never holds store's internal references
- tests for react bridge

### Updated
- exports map: added ```types``` conditions and ```./react``` subpath
- ```ITardigrade``` interface: added ```props``` getter
- root export: types and ```Tardigrade``` class are exported now
- complex props cloning uses ```structuredClone``` when available (json fallback kept), noticeably faster on large objects
- docs

### Fixed
- ```checkObjectInterface```: keys count was read from the interface twice, so objects with extra or missing keys passed the ```strictObjectsInterfaces``` check
- ```importAllResolversListenerHandlers```: merged resolver listeners were written into prop listeners storage, so ```merge``` erased prop listeners and lost resolver listeners

---

## [1.4.0] - 2026-07-04
### Added
- persist layer: subpath export ```tardigrade-store/persist``` with ```persist(store, options)``` returning ```PersistLink```
- snapshot-based auto-save on ```setProp``` / ```setProps``` / ```addProp``` with debounce (```saveAfter```, 0 = sync); resolver calls don't trigger writes
- ```save```, ```restore```, ```forget```, ```peek```, ```hold``` / ```unhold```, ```retain``` / ```drop```, runtime ```pick```, ```dispose``` (+ ```isHeld```, ```isDisposed```)
- envelope format ```{ version, data }``` with ```migrate``` support
- storage adapters: localStorage by default, in-memory fallback for non-browser, custom via ```PersistStorage``` interface
- react hook ```usePersistedTardigrade``` (subpath ```tardigrade-store/persist/react```): creates or accepts a store, restores on client in effect (SSR-safe), detaches on unmount, survives react strict mode remount
- 8 test files for persist
- docs

---

## [1.3.0] - 2026-07-04
### Added
- method ```setProps``` for batch updates: writes several props at once, notifies each prop listener and calls global listeners only once per batch with ```(names: string[], changedValues, props)```
- typed patch for ```setProps```: known prop names are checked against store shape
- react bridge understands batched updates (```useTardigradeProps``` re-renders once per batch)
- ```useTardigradeSelector``` hook: derived values from several props with re-render only when the selector result changes; supports custom equality function, inline selectors work without ```useCallback```
- tests for ```setProps``` and ```useTardigradeSelector```

### Updated
- internals: ```setProp``` and ```silentSetProp``` merged into single ```writeProp``` (no behavior change)
- docs

---

## [1.5.0] - 2026-07-04
### Added
- history layer: subpath export ```tardigrade-store/history``` with ```history(store, options)``` returning ```HistoryLink``` — snapshot-based undo/redo for props
- auto-record on ```setProp``` / ```setProps``` / ```addProp``` (```setProps``` batch = one step); resolver calls don't create steps
- ```undo``` / ```redo```, manual ```record```, ```hold``` / ```unhold``` for bulk operations, ```clear```, ```peek``` / ```peekUndo``` / ```peekRedo```, ```dispose``` (+ ```canUndo```, ```canRedo```, ```isHeld```, ```isDisposed```)
- ```limit``` option (default 50, oldest steps are dropped), ```recordOnStart```, ```pick``` (unpicked props are invisible to history and survive undo), ```onUndo``` / ```onRedo``` callbacks
- restore without ```reset()```: diff-based apply through ```setProp``` / ```addProp``` / ```removeProp```, dynamic props are added and removed by undo/redo
- content-equal snapshots are skipped (no duplicated steps), new change after undo clears the redo branch
- react hook ```useHistory``` (subpath ```tardigrade-store/history/react```): link per store, re-renders on ```canUndo``` / ```canRedo``` flips, disposes on unmount, survives react strict mode remount
- 11 test files for history including persist interplay
- docs

### Updated
- react bridge subscription hooks (```useTardigradeProp```, ```useTardigradeProps```, ```useTardigradeSelector```) migrated to ```useSyncExternalStore```: tearing-safe with React 18 concurrent rendering, SSR-ready via ```getServerSnapshot```; snapshots are cached with content equality so referential stability is preserved; on React 16.8–17 an internal fallback shim is used, peer range stays ```>=16.8```

### Fixed
- ```removeProp``` no longer warns "doesn't have any listeners" when removing a prop that had no listeners

---

## [1.7.0] - 2026-07-05
### Added
- ward layer: subpath export ```tardigrade-store/ward``` with ```ward(store, options)``` returning ```WardLink``` — rules run before a write and can allow, deny or transform the value
- three rule scopes: global ```addRule(fn)```, kind-bound ```addRule("setProp" | "addProp" | "setProps", fn)```, prop-bound shorthand ```addRule(propName, fn)```; execution order global → kind → prop, chain passes transformed value to the next rule
- prop-bound rules match both ```setProp``` and ```addProp``` with that name, so rules can't be bypassed by re-adding a prop
- ```setProps```: a ```"setProps"``` kind rule allows/denies the whole patch once; per-key rules still run for every key of the batch (transform works, a denied key is skipped, the rest is applied)
- denied write is a non-event: no listeners, no persist auto-save, no history step; reported via incidents handler (throws with ```emitErrors: true```) and optional ```onDeny(context, reason)``` callback
- a throwing rule denies the write (fail closed) with the error message as reason
- ```removeRule(id)```, ```clearRules```, ```hold``` / ```unhold``` (bulk merge or restore without rules), ```dispose``` (+ ```ruleCount```, ```isHeld```, ```isDisposed```)
- one active ward per store: second ```ward(store)``` throws until the previous link is disposed; re-entrancy guard prevents rules from re-triggering ward
- rules apply to ```importProps``` / ```merge``` / persist restore / history undo-redo; initial props in ```createTardigrade``` are baseline and skip rules
- core: minimal extension point ```registerWardRunner``` (for the ward package only), ward types in ```lib.ts```, no ward logic in core
- 10 test files for ward
- docs

### Fixed
- ```addProp``` crashed listener notification when the prop was rejected (nullable value, duplicate name): now it notifies only after the prop was actually created
- ```merge``` no longer touches listeners of props that were rejected during import

---

## [1.7.1] - 2026-07-05
### Updated
- license changed from CC BY 4.0 to MIT: standard OSI-approved software license, ```"license": "MIT"``` in package.json, bundle banners updated

---

## [1.8.0] - 2026-07-05
### Added
- vue bridge: subpath export ```tardigrade-store/vue``` for Vue 3 Composition API — ```useTardigradeProp``` (writable ref, ```v-model``` friendly), ```useTardigradeProps```, ```useTardigradeSelector```, ```useTardigradeResolver```, ```useTardigrade```, ```provideTardigradeStore``` / ```useTardigradeStore``` (provide/inject analog of the react provider); subscriptions detach on component/effect scope dispose; vue (>=3.0) is an optional peer dependency
- svelte bridge: subpath export ```tardigrade-store/svelte``` — ```tardigradeProp``` (writable: subscribe/set/update), ```tardigradeProps```, ```tardigradeSelector```, ```tardigradeResolver``` (readable + ```.call()```); implements the svelte store contract by hand, so it works with ```$```-auto-subscription in Svelte 3/4/5 and adds **zero** dependencies
- both bridges share react bridge semantics: cloned values with referential stability (content-equal updates don't notify), ```setProps``` batch arrives as a single update, writes go through the store so ward rules and type checks apply
- tests for both bridges

### Updated
- value clone/compare helpers moved to a shared internal module (```sources/bridge```), react bridge re-exports them (no api change)
- docs

---
