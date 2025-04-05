# Phase 2: Property Explorer MVP

## Goal
Implement the property exploration functionality that allows users to view and interact with property listings, similar to a stock screener.

## Tasks
- [ ] Property Card Implementation
  - [ ] Display basic property info (name, score, price, yield, appreciation, location)
  - [ ] Add visual indicators for scores and metrics
  - [ ] Implement hover and active states
  - [ ] Make cards responsive for different screen sizes

- [ ] Filter Bar Implementation
  - [ ] Create filter UI for location, score, and yield
  - [ ] Add dropdown selectors for filter options
  - [ ] Implement filter state management (local state for MVP)
  - [ ] Connect filters to property display logic

- [ ] Property Detail Modal
  - [ ] Create floating card modal with detailed property view
  - [ ] Display static property image
  - [ ] Add static charts for performance visualization
  - [ ] Show additional property details
  - [ ] Implement close/minimize functionality

- [ ] Watchlist Integration
  - [ ] Add "Save to Watchlist" button to property cards
  - [ ] Implement local storage for saved properties
  - [ ] Add visual indicator for properties already in watchlist

## Boundaries and Constraints
- Use only mock data - no real API calls
- Keep charts static/fixed data for now
- Limit filter options to 3-5 key metrics
- Don't implement complex animations or transitions
- Focus on core functionality over visual polish

## Definition of Done
- Users can view a grid of property cards with key metrics
- Property filters change the displayed properties
- Clicking a property opens a detailed modal view
- Users can save properties to watchlist (locally stored)
- All components render correctly on different screen sizes 