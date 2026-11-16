# egg-him

A one-page prank site where eggs fly in from the edges and splatter across the victim's photo. Tapping/clicking the photo throws direct eggs, and an egg counter keeps score.

## Structure

```
egg-him/
├── index.html       # Single-page static app (vanilla HTML/CSS/JS)
├── photo.jpg        # Pre-cropped square photo
├── favicon.svg      # Splattered egg SVG favicon
├── .nojekyll        # Disables Jekyll processing on GitHub Pages
├── .gitignore
└── README.md
```

## Features

- **Egg Splatter Simulation**: Eggs fly in from random edges using the Web Animations API and splatter onto the victim's photo with dynamic SVG yolk/white blobs and drippings.
- **Interactive Multi-Touch & Rapid Tapping**: Tapping anywhere on his face instantly flings an extra egg right to the touched spot with zero lag (`pointerdown` handling).
- **Egg Counter**: A frosted live badge in the bottom-left tracks every egg that splatters.
- **GitHub Pages Ready**: Hosted at [https://mmccomiskey.github.io/egg-him/](https://mmccomiskey.github.io/egg-him/) with relative asset paths and `.nojekyll`.
