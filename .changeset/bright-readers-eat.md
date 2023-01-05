---
"@casual-ui/react": patch
---

### Refactor
* Reimplement carousel
* Use new hook `useNotFirst` to replace all same logic in components
  
### Bug Fixes
* Remove additional useEffect dependencies listening for CSelect and CCheckboxGroup
* Use padding instead of margin in row col layouts
* Add space for form error tip that might show

### New Features
* Add `useNotFirst` common hook
* Add prop table type light and dark theme code highlight in docs site