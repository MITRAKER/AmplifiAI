# AMPLIFI.AI - Development Instructions

This document provides coding conventions and guidelines for the AMPLIFI.AI neighborhood platform.

## Project Overview

**AMPLIFI.AI** is a hyperlocal neighborhood community platform built with Next.js, Tailwind CSS, and Supabase. The platform enables neighbors to connect, share information, organize events, and foster stronger community relationships.

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Linting**: ESLint

## Folder Structure

```
src/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with Navbar
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── profile/             # Profile page
│   ├── directory/           # Directory page
│   ├── messages/            # Messages page
│   └── block-party/         # Block party events page
├── components/              # Reusable React components
│   └── Navbar.tsx           # Main navigation component
└── lib/                     # Utility functions and configurations
    └── supabase.ts          # Supabase client setup
```

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., `Navbar.tsx`, `ProfileCard.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utilities: camelCase (e.g., `supabase.ts`, `utils.ts`)

### Component Structure
- Use functional components with TypeScript
- Add `'use client'` directive for client-side components
- Export components as default exports
- Keep components focused and reusable

### Styling
- Use Tailwind CSS utility classes
- No inline styles unless absolutely necessary
- Follow the existing color scheme:
  - Primary Blue: `blue-600`
  - Text: `gray-900` for headings, `gray-700` for body
  - Backgrounds: `white` for cards, `gray-50` for sections
- Use responsive design: mobile-first approach

### TypeScript
- Always define types for component props using `interface` or `type`
- Use explicit return types for functions
- Avoid `any` type; use `unknown` and narrow accordingly

### Components Best Practices
- Prefer composition over inheritance
- Keep functions pure and deterministic
- Use React hooks appropriately
- Separate concerns: UI, logic, and data handling

## Page Guidelines

Each page route should follow this pattern:

```typescript
'use client'; // if using client-side features

export default function PageName() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page content */}
    </div>
  );
}
```

## Supabase Integration

All Supabase clients are initialized through `src/lib/supabase.ts`:

```typescript
import { supabase } from '@/lib/supabase';

// Usage in components
const { data, error } = await supabase
  .from('table_name')
  .select('*');
```

Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Navbar Component

The Navbar is the main navigation component located at `src/components/Navbar.tsx`:
- Features responsive mobile menu
- Displays AMPLIFI.AI branding
- Links to all main pages: Home, Directory, Block Party, Messages, Profile
- Uses sticky positioning

## Development Workflow

### Starting Development
```bash
npm run dev
```
Development server runs on `http://localhost:3000`

### Building
```bash
npm run build
```
Produces optimized production build

### Linting
```bash
npm run lint
```
Check for code quality issues

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | page.tsx | Landing page and home |
| `/profile` | profile/page.tsx | User profile management |
| `/directory` | directory/page.tsx | Browse neighbors |
| `/messages` | messages/page.tsx | Direct messaging |
| `/block-party` | block-party/page.tsx | Community events |

## State Management

- Use React hooks (useState, useContext, etc.) for local state
- Use Supabase for data persistence
- Consider Context API for app-wide state needs

## API Integration

- Create API routes in `src/app/api/`
- Follow RESTful conventions
- Use Supabase for database operations
- All sensitive operations should use server-side routes with service role key

## Testing

- Use `npm run lint` for code quality checks
- Test responsive design across devices
- Verify Supabase integration with environment variables

## Performance Optimization

- Use Next.js Image component for images
- Implement lazy loading where appropriate
- Minimize bundle size
- Use CSS modules or Tailwind for styling

## Security

- Never commit `.env.local` or sensitive credentials
- Use `.env.local.example` as template
- Keep Supabase keys in environment variables
- Use Supabase Row Level Security (RLS) for data protection
- Validate and sanitize user inputs

## Git Conventions

- Use descriptive commit messages
- Branch naming: feature/feature-name, fix/bug-name, docs/doc-name
- Keep commits atomic and focused
- Write clear pull request descriptions

## Common Tasks

### Adding a New Page
1. Create folder in `src/app/route-name/`
2. Create `page.tsx` inside
3. Update Navbar.tsx with new route link
4. Add route to README.md

### Adding a New Component
1. Create file in `src/components/ComponentName.tsx`
2. Define TypeScript interface for props
3. Export as default export
4. Use in pages as needed

### Using Supabase
1. Import from `@/lib/supabase`
2. Call supabase methods (select, insert, update, delete)
3. Handle errors and loading states
4. Use async/await or promises

## Troubleshooting

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run lint`

### Supabase Connection
- Verify environment variables in `.env.local`
- Check Supabase project is active
- Review browser console for errors

### Styling Issues
- Check Tailwind CSS configuration
- Ensure classes are properly spelled
- Clear browser cache

## Deployment

### To Vercel
```bash
vercel
```

### Environment Setup
Configure these on your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Production Checklist
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Supabase security rules reviewed
- [ ] All routes tested in production
- [ ] Performance optimized
- [ ] Analytics configured (optional)

## Future Enhancements

Suggested features for future development:
- User authentication system
- Real-time messaging notifications
- Event RSVP system
- Community map view
- User ratings and reviews
- Mobile app version
- Social features (likes, comments, shares)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support & Questions

For issues or questions about the codebase:
1. Check the README.md
2. Review official documentation
3. Check existing code patterns
4. Create detailed issue descriptions with error logs

---

**Last Updated**: March 2026
**Project Version**: 0.1.0
