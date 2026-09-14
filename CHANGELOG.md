# Changelog

All notable changes to this package are documented here.

## 0.5.0

### Changed

- Removed the hardcoded `temperature: 0.7` on the OpenAI provider. The two
  providers previously ran at different, undocumented sampling temperatures —
  OpenAI pinned to 0.7, Anthropic left unset (SDK default 1.0). Anthropic's
  `temperature` parameter is deprecated for models released after Claude Opus
  4.6 (this package defaults to `claude-opus-5`) and rejects any non-1.0 value
  with a 400 error, so parity could only be reached by moving OpenAI to 1.0
  rather than adding the option to Anthropic. OpenAI output may read slightly
  more varied than before as a result — the higher setting also suits
  character-voice transformation better than the previous conservative value.

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
