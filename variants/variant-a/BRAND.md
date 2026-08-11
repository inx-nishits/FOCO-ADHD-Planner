# FOCO Variant A — Brand Foundation Notes

## Direction

**Premium FOCO Evolution** — recognizable FOCO identity, substantially more polished.

## Official logo

- Path: `/assets/images/foco-logo.png`
- Source: `C:\Projects\FOCO-App\assets\images\foco-logo.png`
- Specs: **90×86**, **RGBA** (transparency), mascot mark with purple glow
- CSS: `.foco-logo` (+ `--sm` / `--md` / `--lg` / `--xl`)
- Always preserve aspect ratio (`90 / 86`). Do not crop, recolor, or regenerate.

```html
<img
  class="foco-logo foco-logo--md"
  src="/assets/images/foco-logo.png"
  alt="FOCO"
  width="48"
  height="46"
/>
```

## Brand references

- Website: https://www.tryfoco.com/
- Typography direction: Inter
- Atmosphere: dark, calm, violet-accented, focus-oriented

## Mascot usage

The FOCO mascot (this logo asset) is a brand companion, not chrome decoration.

**Use for**

- Splash / welcome
- Empty states that need encouragement
- Focus Mode companion presence
- Celebration / streak moments
- Onboarding personality beats

**Do not use for**

- Persistent header on every screen
- Dense lists / settings rows
- Error-only messaging
- Replacing icons or bullets

Intentional presence > frequency.

## Purple / glow discipline

Stronger purple + glow only for:

- Primary CTA
- Active / selected states
- Focus Mode
- AI moments
- Progress that matters
- Premium highlights

Normal UI stays quieter (surfaces, borders, muted text).

## Cognitive-load principle

Future screens should make the next action obvious:

- One primary action
- Clear hierarchy
- Progressive disclosure
- Minimal visual noise
