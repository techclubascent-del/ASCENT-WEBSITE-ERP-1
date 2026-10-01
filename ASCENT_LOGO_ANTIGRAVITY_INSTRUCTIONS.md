# ASCENT Logo — Antigravity Implementation Instructions

## Source of truth

Use `ascent-logo-exact.svg` as the **official ASCENT Tech Club logo asset**.

The SVG intentionally embeds the original supplied artwork so the appearance remains exactly the same as the provided reference image.

### Do not

- Recreate the logo using HTML/CSS shapes.
- Re-type the word `ASCENT`.
- Substitute another font.
- Redraw or approximate the triangular mark.
- Change the proportions, spacing, or geometry.
- Apply filters, gradients, shadows, outlines, or color changes.
- Generate a replacement logo with an AI image generator.
- Stretch the image non-uniformly.

## Website implementation

Use the SVG as a normal image asset:

```html
<img
  src="/assets/ascent-logo-exact.svg"
  alt="ASCENT"
  class="ascent-logo"
/>
```

Recommended CSS:

```css
.ascent-logo {
  display: block;
  width: 140px;
  height: auto;
  object-fit: contain;
}
```

For the existing dark ASCENT interface, keep the logo visually unchanged. The supplied asset already contains the black background from the original artwork.

## Header / navbar

If the existing navbar currently has a separately recreated ASCENT icon and wordmark, remove that recreated markup and replace it with the supplied SVG asset.

Use the SVG as a single source-of-truth brand asset. Keep its aspect ratio locked.

Example:

```jsx
<a href="/" aria-label="ASCENT Home" className="brand">
  <img
    src="/assets/ascent-logo-exact.svg"
    alt="ASCENT"
    className="brand-logo"
  />
</a>
```

```css
.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-logo {
  display: block;
  width: 110px;
  height: auto;
  object-fit: contain;
}
```

Adjust only the rendered **size**, never the artwork itself.

## Important visual requirement

The supplied logo image is the authoritative visual reference. The implementation should reproduce it exactly. Do not attempt to make a "cleaner", "more modern", "more minimal", or "vector-looking" version.

If a different logo presentation is required for a specific UI location, preserve this asset as the official master and create a separate explicitly named variant rather than modifying the master file.

## File placement

Place:

```text
ascent-logo-exact.svg
```

in the project's existing public/static assets directory, for example:

```text
public/assets/ascent-logo-exact.svg
```

Then update the existing logo references to point to that file.

## Acceptance criteria

- Logo artwork matches the supplied reference exactly.
- Original proportions are preserved.
- No replacement font is introduced.
- No CSS recreation of the logo exists.
- No duplicated logo artwork exists elsewhere in the interface.
- Logo remains sharp and correctly scaled at different viewport sizes.
- Existing navbar spacing and alignment are preserved as much as possible.
