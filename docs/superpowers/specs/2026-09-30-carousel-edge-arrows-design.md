# Carousel Edge Arrows on Phones — Design

Date: 2026-09-30
Status: Approved by user

## Problem

Pricing (and testimonial) cards share the tallest card's height. On phones one card is shown at a time, so the track is taller than the screen and the prev/next controls below it end up off-screen; shorter cards also show an empty white block at the bottom.

## Design (option B, chosen by the user)

Below `lg` (1024px), for both the Pricing and Testimonials carousels:

- **Edge arrows:** two round arrow buttons overlay the card's left and right edges, each centred on the edge (half on the card, half on the page gutter). White background and soft shadow for legibility over card content. Same labels ("Previous", "Next") and disabled behaviour (40% opacity at the first/last page) as today.
- **Always reachable:** the arrows live in an overlay the height of the track, inside which they are `position: sticky` at the vertical middle of the viewport. While any part of the card is on screen, the arrows stay on screen, clamped to the card's area.
- **Dots:** the page dots move to their own row, centred under the card.
- **Natural heights:** cards align to the top of the track (`items-start`) below `lg`, so shorter cards no longer stretch with empty filler.

From `lg` up, nothing changes: the existing `‹ • • ›` controls stay where they are and cards keep equal heights.

## Units

- `CarouselDots` — extracted from `CarouselControls` (dots only); `CarouselControls` keeps using it.
- `CarouselEdgeArrows` — new, phones-only overlay (`lg:hidden`) rendering the two sticky edge buttons.
- `Pricing` / `Testimonials` — wrap the track in a `relative` container holding the overlay; show `CarouselDots` under the track below `lg`; hide the old phone controls.

## Verification

At 375×812 and 375×667: arrows on screen with the tallest card's top, middle and bottom in view; arrows page correctly, dim at the ends, dots stay in sync; page width equals the viewport (no overflow). At 1440: desktop controls unchanged.
