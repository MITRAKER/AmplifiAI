# AMPLIFI.AI - Hyperlocal Neighborhood Platform

**AMPLIFI.AI** is a Next.js-powered hyperlocal neighborhood platform designed to connect neighbors, share community information, organize events, and foster stronger neighborhood connections.

## 🌟 Features

- **Home Dashboard**: Landing page showcasing platform features and community benefits
- **Neighborhood Directory**: Browse and connect with neighbors in your community
- **Messages**: Direct messaging system for neighbor-to-neighbor communication
- **Block Party Events**: Organize and discover community events and celebrations
- **User Profiles**: Manage your community profile and preferences
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Real-time Updates**: Powered by Supabase for real-time data synchronization

## 📋 Tech Stack

- **Framework**: [Next.js 16.2.1](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Language**: TypeScript
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd amplifi-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

### How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** → **API** in your project dashboard
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
amplifi-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navbar
│   │   ├── page.tsx            # Home/landing page
│   │   ├── globals.css         # Global styles
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile page
│   │   ├── directory/
│   │   │   └── page.tsx        # Neighborhood directory
│   │   ├── messages/
│   │   │   └── page.tsx        # Messaging interface
│   │   └── block-party/
│   │       └── page.tsx        # Events and block party page
│   ├── components/
│   │   └── Navbar.tsx          # Navigation bar with AMPLIFI.AI branding
│   └── lib/
│       └── supabase.ts         # Supabase client configuration
├── .env.local.example          # Environment variables template
├── package.json                # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔗 Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Home/Landing page |
| `/profile` | User profile management |
| `/directory` | Neighborhood member directory |
| `/messages` | Direct messaging |
| `/block-party` | Community events |

## 🎨 Customization

### Navbar Styling

The navbar is located at `src/components/Navbar.tsx` and features:
- AMPLIFI.AI branding with blue/gray color scheme
- Responsive mobile menu
- Links to all main pages
- Sticky positioning for easy navigation

### Colors & Branding

Primary colors used:
- **Blue**: `#2563EB` (Tailwind `blue-600`)
- **Dark Gray**: Text on white backgrounds
- **White**: Backgrounds and cards

Modify Tailwind colors in `tailwind.config.ts` to customize the theme.

## 🔒 Secure Setup for Production

When deploying to production:

1. Keep sensitive environment variables in secure hosting environment
2. Use Supabase Row Level Security (RLS) to protect user data
3. Enable authentication in Supabase
4. Review Supabase security settings and permissions
5. Consider using `SUPABASE_SERVICE_ROLE_KEY` only for server-side operations

## 📦 Build & Deploy

### Build for production:

```bash
npm run build
npm run start
```

### Deploy to Vercel (recommended):

```bash
# Install Vercel CLI globally (optional)
npm i -g vercel

# Deploy
vercel
```

The project is optimized for deployment on [Vercel](https://vercel.com), the creators of Next.js.

## 🧪 Linting

Check for code quality issues:

```bash
npm run lint
```

## 📝 Next Steps

To expand the AMPLIFI.AI platform:

1. **Set up Supabase Database**:
   - Create `profiles`, `messages`, and `events` tables
   - Set up authentication with Supabase Auth

2. **Implement Features**:
   - User authentication
   - Real-time messaging with Supabase Realtime
   - Event creation and management
   - Neighborhood map view

3. **Add API Routes**:
   - Create API endpoints in `src/app/api/`
   - Connect to Supabase for data operations

4. **Mobile Optimization**:
   - Test on various devices
   - Consider PWA capabilities

## 🤝 Contributing

This is an initial setup for the AMPLIFI.AI platform. Feel free to extend and customize it for your neighborhood community needs.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
- Check [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase guides](https://supabase.com/docs)
- Check [Tailwind CSS documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ for neighborhood communities**
