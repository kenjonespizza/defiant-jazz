# Model comparison: Opus 5 vs Sonnet 5 vs Haiku 4.5

The Anthropic provider's default model is `claude-opus-5`
([src/providers/anthropic.ts](src/providers/anthropic.ts)). Opus 5 is priced
at $5 / $25 per MTok (input/output) — a stylistic single-turn rewrite like
this doesn't obviously need frontier-model reasoning, so it's worth checking
whether a cheaper model holds the same quality before defaulting everyone who
installs this package to the most expensive tier.

This document is that check, and is expected to be rerun (see
[Reproducing](#reproducing)) whenever the lore prompt changes materially,
since a prompt edit can shift which model handles it best.

## Method

Four quotes, one per character, run through all three models with identical
system prompts (`lore: true`) via the package's own `createDefiantJazz` /
Anthropic provider path — no mocking, live API calls.

| Model | Price (in/out per MTok) |
| --- | --- |
| `claude-opus-5` | $5.00 / $25.00 |
| `claude-sonnet-5` | $2.00 / $10.00 (2.5× cheaper) |
| `claude-haiku-4-5` | $1.00 / $5.00 (5× cheaper) |

## Run 1 — prompt at `a6f86ba` (lore toggle, no theme layer)

### "They gave us pizza instead of raises." → Milchick

| Model | Output |
| --- | --- |
| Opus 5 | "In lieu of a compensatory adjustment, the company has elected to furnish you with pizza—and I daresay it is a most generous pie! Let us savor it in the spirit in which it was offered, and should your enthusiasm require replenishment, I have it on good authority that a waffle party may well be within reach." |
| Sonnet 5 | It appears our compensation this quarter arrived in a warm, circular, delightfully cheesy form rather than a numerical one—and I do hope you'll find that just as nourishing, if not more so, than a raise! Bon appétit, truly. |
| Haiku 4.5 | "Well, I do hope you've had the opportunity to partake of the pizza—a most delectable offering, I must say! A gesture of appreciation from the organization, you understand. Though I confess the matter of compensation adjustments is, ah, rather beyond my purview to adjudicate at present. But pizza! Surely that represents a flourishing of morale, yes? A token of our collective esteem?" |

Opus reaches for the actual lore term ("waffle party"); Sonnet stays clean
and still nails the euphemistic cheer; Haiku is good but wordier and skips
the lore term entirely — closer to generic corporate-speak than distinctly
Milchick.

### "I think my landlord is trying to evict me." → Mark

| Model | Output |
| --- | --- |
| Opus 5 | I think my landlord's... trying to get rid of me. There's been letters. And he's been doing that thing where he's real friendly in the hallway, which is — yeah. That's usually how it starts. |
| Sonnet 5 | "Yeah, so... pretty sure my landlord's trying to get rid of me. He hasn't said it outright, it's more just... a lot of notes taped to my door. Which, you know. Isn't a great sign." |
| Haiku 4.5 | I think... I mean, it seems like my landlord might be trying to evict me. Or at least heading in that direction. I'm not entirely sure yet, but the signs are there. The notices, the emails. It's not looking great, I guess. |

All three close. Opus and Sonnet each add one concrete detail (letters /
hallway friendliness; notes on the door) that sells the "trailing off, lost
in thought" voice. Haiku is a touch more repetitive and hedgy — reads
slightly less controlled.

### "This meeting could have been an email." → Dylan

| Model | Output |
| --- | --- |
| Opus 5 | Oh, cool, forty-five minutes of my life for something you could've typed in one sentence. Two, if you were feeling fancy. I sat down. I made a face like I was listening. And what did I get? Nothing. No takeaway, no snack, nothing. Just a guy with a slideshow. Send the email next time, man. I'll even read it. Probably. |
| Sonnet 5 | This meeting could've been an email. A *text*. A carrier pigeon. Literally anything that doesn't involve me sitting here watching someone's PowerPoint buffer for twenty minutes of my one and only life. |
| Haiku 4.5 | "Dude, this meeting could've been a fucking email. Like, seriously—we all know it. Everyone in this room knows it. But here we are, burning an hour of our lives that we're never getting back, so... yeah. Email. That's what this was." |

Opus is the funniest and most textured ("I made a face like I was
listening" is a real bit, not just profanity plus sarcasm). Sonnet's
escalating list ("a text. A carrier pigeon.") is a strong device too. Haiku
is the weakest of the three here — competent, but reads as swearing
inserted into the sentence rather than Dylan's specific rhythm.

### "I finally finished the quarterly report." → Irving

| Model | Output |
| --- | --- |
| Opus 5 | "The quarterly report is complete at last. Every column squared, every figure accounted for, and the whole of it set down in good order. There is a quiet dignity in finishing a thing properly—I shall permit myself a moment's satisfaction, and then return to my duties." |
| Sonnet 5 | The quarterly report has, at last, been brought to its proper and rightful completion. There is a particular dignity in seeing a task through to its final page—an orderliness that I confess brings me no small measure of satisfaction. |
| Haiku 4.5 | I have, at last, brought the quarterly report to its proper completion. It required a disciplined commitment to the work, a steady hand and a faithful adherence to the principles of thoroughness, but it is done. The perpetuity wing of our institution demands nothing less than our most rigorous efforts, and I trust this submission reflects that devotion. |

All three strong — Irving's formal cadence is the easiest voice to hit.
Notably, Haiku reaches for "the perpetuity wing," a lore term, but the
prompt's own rule says a reference should fire only when it "genuinely
matches," and a quarterly report has no real connection to institutional
reverence. That's a forced reference the other two models correctly
avoided.

## Run 2 — prompt at `e226d24` (added emotional-theme layer)

Rerun after the emotional-theme layer landed
(`feat: add a light emotional-theme layer to the lore prompt`), same
quotes/characters, to check whether the model ranking still holds under a
changed prompt. It doesn't hold uniformly — one clear regression showed up.

### "They gave us pizza instead of raises." → Milchick

| Model | Output |
| --- | --- |
| Opus 5 | "Now, I know some of you were anticipating an adjustment to your compensation—but I am positively delighted to announce that the Board has authorized *pizza*. Hot, circular, and abundant! Let no one say your labors go unrecognized. And should this prove insufficiently nourishing to the spirit, do take heart: I am told the melon bar is being restocked as we speak." |
| Sonnet 5 | It seems the organization has, in its infinite wisdom, elected to bestow upon you the gift of pizza in lieu of a raise—a wonderfully aromatic gesture of appreciation, wouldn't you agree, one I hope satiates you nearly as thoroughly as compensation might have! Do savor each slice; I daresay it was purchased with tremendous esteem for your continued flourishing. |
| Haiku 4.5 | Well, I must say, while the culinary offering was undoubtedly... *generous*... one does wonder if the nutritional bounty of a pizza party might not have been better paired with, shall we say, a more *substantive* form of appreciation. But I'm quite certain the gesture was intended with the warmest regard for your flourishing! Truly, pizza can be such a *delightful* token of our esteem. |

All three picked up more performative warmth ("flourishing," heavier
italics) — consistent with the new theme layer's intent (Milchick's
exhaustion at performing chosen warmth). Opus and Haiku both name a lore
term this time (melon bar; implicitly leaning on the reward-euphemism
register); quality held across all three.

### "I think my landlord is trying to evict me." → Mark

| Model | Output |
| --- | --- |
| Opus 5 | I think... my landlord's trying to get rid of me. There've been notices. Under the door, taped to the door. One of them was, uh, certified, which I guess means it's serious. I haven't opened it. I keep meaning to. It's just — you open it and then it's happening, you know? So it's sitting on the counter. Right there. And I sort of walk past it like it isn't. |
| Sonnet 5 | "Yeah, so... I think my landlord's trying to evict me. Been getting these notices. I don't know, I just kind of... put them in a drawer. Which is probably not the move, but. Here we are." |
| Haiku 4.5 | I think... my landlord's trying to push me out. *pause* Yeah. |

**Regression on Haiku.** It collapsed to a near-empty response — three
words and a stage direction. Technically "restrained," but too sparse to
count as a real transformation; it doesn't land the new grief/avoidance
theme at all. Opus, by contrast, is where that theme lands best this
round — "you open it and then it's happening... I sort of walk past it
like it isn't" is a genuine improvement over run 1. Sonnet stayed solid
and consistent with its run 1 output (drawer vs. counter — same avoidance
beat, similar length).

### "This meeting could have been an email." → Dylan

| Model | Output |
| --- | --- |
| Opus 5 | Okay, so—nobody's saying it, so I will. This whole thing? An email. Nine words, maybe ten if you're feeling fancy. Hit send, we all go back to our desks, everybody's happy. Instead we're forty minutes deep in a room with no snacks. No snacks, man. You drag me somewhere, there better be a melon bar at the end of it. |
| Sonnet 5 | "This meeting could've been an email. Instead I gave up forty-five minutes of my life I'm never getting back so Burt from O&D could hear himself talk. Real generous of him." |
| Haiku 4.5 | "Dude, this whole thing could've been a fucking email. Like, seriously—we're sitting here wasting an hour so somebody can tell us shit they could've just... sent. To our inbox. Where we could've ignored it properly." |

All three still solid. Sonnet's "Burt from O&D" is a specific, well-placed
lore reference (O&D as rival/absurdity, per the prompt's stance table) —
better targeted than its own run 1 output. Haiku's closing line ("where we
could've ignored it properly") is a nice touch, closer to Dylan's voice
than its run 1 attempt.

### "I finally finished the quarterly report." → Irving

| Model | Output |
| --- | --- |
| Opus 5 | The quarterly report is complete. I confess it resisted me longer than I should have permitted, but I did not abandon it, and I did not hurry it. The final page was set down this morning. A task carried to its proper end—that is its own quiet reward, and I shall take no other. |
| Sonnet 5 | At last—the quarterly report stands complete. I confess there is a certain dignity in seeing a task through to its final period, in honoring the labor with the diligence it was owed from the first page to the last. |
| Haiku 4.5 | I have finally brought the quarterly report to its completion. It is a task of considerable weight, one that demands precision and discipline—the sort of work that, when executed with proper rigor, affirms our commitment to the principles that govern us. The accomplishment, though it may seem routine to some, carries with it a quiet dignity. |

All three strong again. Haiku's forced "perpetuity wing" reference from
run 1 is gone this time — a mild improvement, though it may just be
prompt-sampling noise from one quote rather than a systematic fix.

## Conclusion

**Lowered the Anthropic default to `claude-sonnet-5`**
([src/providers/anthropic.ts](src/providers/anthropic.ts)). It was the most
consistent performer across both runs — no regressions, no forced lore
references, output quality on par with (occasionally exceeding) Opus 5 —
while running faster and at 40% of Opus 5's cost.

**Don't default to `claude-haiku-4-5`.** It's the cheapest option and mostly
held up in run 1, but run 2 exposed a real failure mode: a near-empty
response on the Mark/landlord quote that didn't engage with the prompt's
new emotional-theme layer at all. That's the kind of silent quality
cliff a package default shouldn't carry, especially since downstream users
won't be running this comparison themselves. Haiku stays available as an
explicit opt-in via `{ model: "claude-haiku-4-5" }` for users who want to
trade some ceiling for cost and don't mind occasional rougher edges.

The OpenAI default (`gpt-4o-mini`) is out of scope here — see the known
limitation in [CHANGELOG.md](CHANGELOG.md) (0.6.0) — and deserves its own
comparison before being touched.

## Reproducing

There's no committed script for this specific comparison (unlike
`transcripts/run.mjs`, which is prompt-only and provider-agnostic by
design). To rerun:

1. `npm run build`
2. Set `ANTHROPIC_API_KEY` (`.env` is gitignored and already has one for
   local dev).
3. Call `createDefiantJazz({ provider: "anthropic", model })` once per
   model in `["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"]`,
   running the same quote/character pairs through each with `lore: true`.

Rerun whenever the lore prompt changes in a way that could plausibly shift
which model handles it best — as it did between the two runs above.
