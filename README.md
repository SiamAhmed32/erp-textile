# Premium Next.js Starter Template

A production-ready Next.js starter template with modern tooling and best practices. Built for rapid application development with a focus on performance and developer experience.

> **👉 New to this template?** Check out the [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for a step-by-step guide on how to make this template your own!

## ✨ Features

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Latest version with high-performance engine
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with RTK Query for efficient data fetching
- **UI Components**: Comprehensive design system with reusable layout components
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **TypeScript**: Full type safety throughout the application
- **Utilities**: Pre-built helpers for SSR, styling, and common operations

## � Project Structure

```text
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles & theme
├── components/
│   ├── Layout/          # Layout wrapper components
│   ├── Navbar/          # Navigation components
│   ├── Footer/          # Footer components
│   ├── Homepage/        # Homepage sections (example)
│   ├── data/            # Static data & configuration
│   └── reusables/       # Reusable UI components (Box, Flex, Grid, Typography)
├── lib/
│   ├── ssr/             # Server-side rendering utilities
│   └── utils.ts         # Helper functions (cn for class merging, etc.)
└── store/
    ├── index.tsx        # Redux store configuration
    ├── provider/        # Redux provider setup
    ├── services/        # RTK Query API services
    ├── slices/          # Redux slices (example: auth, cart, wishlist)
    └── constants.ts     # App constants
```

## � Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (you can copy from `.env.example`):

```env
# API Configuration
NEXT_PUBLIC_BACKEND=http://localhost:5000
NEXT_PUBLIC_TOKEN_NAME=APP_TOKEN
NEXT_PUBLIC_REFRESH=APP_REFRESH
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### 4. Build for Production

```bash
npm run build
npm run start
```

## 🎨 Customization

### Theme Configuration

Edit `src/app/globals.css` to customize colors, fonts, and spacing:

```css
:root {
  --primaryBg: #f5f5f2;
  --primaryCard: #ffffff;
  --primaryText: #424141;
  --button: #009669;
  --button-dark: #008059;
  --borderBg: #ddd;
  --font-primary: "Lora", serif;
  --font-secondary: "Newsreader", serif;
}
```

### Component Data

Update static data in `src/components/data/`:

- `navData.ts` - Navigation menu items
- `footerData.tsx` - Footer content and links

### Redux Store

Example slices are provided in `src/store/slices/`. Customize or remove based on your needs:

- `authSlice.ts` - Authentication state
- `cartSlice.ts` - Shopping cart (for e-commerce apps)
- `wishlistSlice.ts` - User wishlist
- `buyNowSlice.ts` - Quick purchase flow
- `tableSlice.ts` - Table/data management

### API Services

Configure your API endpoints in `src/store/services/`. Example services included:

- `authApi.tsx` - Authentication endpoints
- `mainApi.ts` - Main API configuration
- `commonApi.ts` - Common/shared endpoints
- `uploadApi.ts` - File upload handling

## 🧩 Reusable Components

The template includes a comprehensive set of layout components in `src/components/reusables/`:

- **Layout**: `Box`, `Flex`, `Grid`, `Container`, `Column`, `SectionGap`
- **Typography**: `PrimaryHeading`, `SecondaryHeading`, `PrimaryText`, etc.
- **Buttons**: `ButtonPrimary`, `ButtonSecondary`
- **Forms**: Input fields, select boxes with built-in styling
- **Other**: Cards, dividers, and utility components

## 📦 What's Included

- Pre-configured ESLint for code quality
- TypeScript support out of the box
- Optimized build configuration
- SSR utilities and helpers
- Responsive design system
- Dark mode ready (via CSS variables)
- SEO-friendly structure

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📄 License

MIT License - feel free to use this template for your projects.
