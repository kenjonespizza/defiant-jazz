# Changelog

All notable changes to this package are documented here.

## 0.4.1

### Fixed

- `refine`/`createDefiantJazz` instances now validate the character key before
  making an API call. Previously an unknown key (e.g. a typo like `"milcheck"`)
  silently produced `undefined`, which was sent to the provider as part of the
  prompt — resulting in a garbage response and a billed API call instead of an
  error.
- Passing an options object where a character key is expected (a common
  mix-up between the generic `refine(text, character, options)` form and the
  `refine.dylan(text, options)` method form) now throws immediately with a
  message pointing at the correct call shape, instead of failing the same
  silent way.
