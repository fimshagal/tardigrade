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
