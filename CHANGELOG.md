# Changelog

All notable changes to this package are documented here.

## 0.6.0

### Known limitation

- Prompt adherence to the stance matrix is noticeably weaker on OpenAI
  (`gpt-4o-mini`) than on Anthropic in manual spot-checks: characters
  sometimes gesture vaguely near a Lumon term instead of naming it, or skip
  a genuinely-earned reference (e.g. Milchick not naming "the break room"
  when threatening someone, despite that being his most central stance).
  Two rounds of manual prompt tweaking produced mixed, non-convergent
  results (fixing one probe case regressed another), suggesting this needs
  a proper eval set (multiple quotes × characters × providers, compared
  systematically) rather than further ad hoc adjustment. Tracked as a
  follow-up; not blocking this release since the toggle mechanism itself
  is verified correct on both providers.

### Added

- Characters now reach for Lumon/*Severance* workplace vocabulary — the break
  room, waffle parties, Kier and the Nine Principles, innie/outie, O&D, Cold
  Harbor, and more — when a quote's situation genuinely calls for it. Each
  character has a distinct stance toward each term grounded in the show (e.g.
  Milchick sends people to the break room and bestows waffle parties; Dylan
  gets sent and covets the parties; Irving is a reverent believer in Kier;
  Mark is largely indifferent to all of it). Usage is deliberately
  restrained — most responses include no reference at all, never more than
  one.
- New `lore?: boolean` option on both `DefiantJazzOptions` (instance-level)
  and `RefineOptions` (per-call), defaulting to `true`. Set `false` for a
  clean voice-only transformation with no show vocabulary. Per-call setting
  overrides the instance setting.

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
