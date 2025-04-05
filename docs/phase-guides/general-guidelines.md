# Atlas Dashboard MVP - General Guidelines

## Core Development Principles

### Sequential Building
- Complete each phase fully before moving to the next
- Use feature branches for each phase
- Don't move forward until current phase meets "Definition of Done"
- Keep track of progress using phase guide checklists

### Efficient Development
- Don't overbuild - stick to what's defined in the phase guides
- Reuse components whenever possible
- Optimize for maintainability over perfect implementation
- Use libraries judiciously - avoid dependency bloat
- Document decisions and technical debt

### Context Awareness
- Always consider the full project scope before making decisions
- Reference guide documents regularly to maintain focus
- Consider how current work impacts future phases
- Maintain consistent conventions across components
- Document API interfaces between modules

## Technical Standards

### Code Quality
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions
- Keep components modular and reusable
- Document props and interfaces

### UI/UX Standards
- Follow a financial/fintech visual design language
- Use a consistent color palette across all components
- Maintain accessibility standards (WCAG 2.1 AA)
- Ensure responsive design for all components
- Use consistent spacing, typography, and interaction patterns

### Performance Guidelines
- Optimize loading times for property cards
- Lazy load components when appropriate
- Minimize render cycles with proper memoization
- Optimize image assets for web
- Implement virtualization for long lists

### Data Management
- Use a consistent approach for data fetching and management
- Implement proper loading/error states
- Create realistic mock data that scales
- Structure data for future API integration
- Document data models and schemas

## Project Organization
- Keep consistent project structure
- Document all mock services
- Maintain clear comments for complex logic
- Use descriptive commit messages
- Update phase guides as tasks are completed 