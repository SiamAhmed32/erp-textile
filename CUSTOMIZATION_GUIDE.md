# Customization Guide

This starter template comes with example implementations that you can customize for your specific needs. This guide will help you understand what to modify to make it your own.

## 🎯 Quick Start Customization Checklist

### 1. Branding & Content

#### Footer Data (`src/components/data/footerData.tsx`)

- [ ] Update `companyInfo.name` with your company/app name
- [ ] Replace `companyInfo.description` with your tagline
- [ ] Update `contactInfo` with your actual address, phone, and email
- [ ] Add your social media links to `socialLinks`
- [ ] Modify `copyright` text

#### Navigation (`src/components/data/navData.ts`)

- [ ] Replace navigation items in `navDataLeft` with your main menu
- [ ] Update `navDataRight` with your CTA/action links
- [ ] Create corresponding pages for each navigation item

### 2. Styling & Theme

#### Colors & Fonts (`src/app/globals.css`)

```css
:root {
  --primaryBg: #f5f5f2; /* Main background color */
  --primaryCard: #ffffff; /* Card/panel background */
  --primaryText: #424141; /* Main text color */
  --button: #009669; /* Primary button color */
  --button-dark: #008059; /* Button hover/active state */
  --borderBg: #ddd; /* Border colors */

  /* Typography */
  --font-primary: "Lora", serif;
  --font-secondary: "Newsreader", serif;

  /* Spacing */
  --sectionGapLg: 64px;
  --sectionGapSm: 44px;
  --pagePadX: 80px;
}
```

**To customize:**

1. Choose your color palette
2. Update CSS variables in `:root`
3. (Optional) Change Google Fonts imports at the top of the file
4. Update `--font-primary` and `--font-secondary` to match your fonts

### 3. Homepage Content (`src/app/page.tsx`)

Replace the demo content with your actual application content:

- Update hero section text and CTAs
- Replace the three feature cards with your features
- Add your own sections (testimonials, pricing, etc.)

### 4. Environment Variables

Create `.env.local` and configure:

```env
# Your backend API URL
NEXT_PUBLIC_BACKEND=https://api.yourdomain.com

# Token storage keys (optional, has defaults)
NEXT_PUBLIC_TOKEN_NAME=YOUR_APP_TOKEN
NEXT_PUBLIC_REFRESH=YOUR_APP_REFRESH
```

### 5. Redux Store - Remove What You Don't Need

The template includes example Redux slices for common use cases. **Remove any you don't need:**

#### E-commerce Slices (Remove if not building e-commerce)

- `src/store/slices/cartSlice.ts` - Shopping cart
- `src/store/slices/wishlistSlice.ts` - User wishlist
- `src/store/slices/buyNowSlice.ts` - Quick purchase flow

After removing slices, update:

- `src/store/index.tsx` - Remove from store configuration

#### Keep & Customize

- `src/store/slices/authSlice.ts` - Authentication (most apps need this)
- `src/store/slices/tableSlice.ts` - Data table state management

### 6. API Services (`src/store/services/`)

The template includes RTK Query service examples:

**To customize:**

1. Update `BACKEND_URL` in your services
2. Modify endpoints in `authApi.tsx`, `mainApi.ts`, etc.
3. Add your own API endpoints
4. Remove unused API files

Example:

```typescript
// src/store/services/yourApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const yourApi = createApi({
  reducerPath: "yourApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND,
  }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "/items",
    }),
  }),
});
```

### 7. Metadata & SEO

#### Update `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description for SEO",
};
```

#### Add favicon

Replace `src/app/favicon.ico` with your own favicon

### 8. Components

#### Remove Example Components

- Remove `src/components/Homepage/Banner` if not needed
- Clean up any unused components in `src/components/`

#### Use Reusable Components

The template includes a comprehensive design system in `src/components/reusables/`:

- Layout: `Box`, `Flex`, `Grid`, `Container`, `Column`
- Typography: `PrimaryHeading`, `SecondaryHeading`, `PrimaryText`
- Buttons: `ButtonPrimary`, `ButtonSecondary`
- And many more...

## 📝 Example: Converting to Your Project

Let's say you're building a SaaS product called "DataDash":

### Step 1: Update Branding

```typescript
// src/components/data/footerData.tsx
export const footerData = {
  companyInfo: {
    name: "DataDash",
    description:
      "Transform your data into actionable insights\nwith our powerful analytics platform.",
  },
  // ... rest of config
};
```

### Step 2: Update Navigation

```typescript
// src/components/data/navData.ts
export const navDataLeft = [
  { title: "Features", url: "/features" },
  { title: "Pricing", url: "/pricing" },
  { title: "Docs", url: "/docs" },
  { title: "Blog", url: "/blog" },
];

export const navDataRight = [
  { title: "Sign In", url: "/auth/login" },
  { title: "Start Free Trial", url: "/signup" },
];
```

### Step 3: Customize Theme

```css
/* src/app/globals.css */
:root {
  --primaryBg: #0f172a; /* Dark blue background */
  --primaryCard: #1e293b; /* Slightly lighter card bg */
  --primaryText: #f1f5f9; /* Light text */
  --button: #3b82f6; /* Blue primary button */
  --button-dark: #2563eb; /* Darker blue for hover */
  --font-primary: "Inter", sans-serif;
}
```

### Step 4: Remove E-commerce Features

Delete these files:

- `src/store/slices/cartSlice.ts`
- `src/store/slices/wishlistSlice.ts`
- `src/store/slices/buyNowSlice.ts`

Update `src/store/index.tsx` to remove these reducers.

### Step 5: Add Your API

```typescript
// src/store/services/dashboardApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/dashboard",
    }),
    getAnalytics: builder.query({
      query: (params) => `/analytics?${new URLSearchParams(params)}`,
    }),
  }),
});

export const { useGetDashboardQuery, useGetAnalyticsQuery } = dashboardApi;
```

## 🚀 Next Steps

After basic customization:

1. **Create your pages** in `src/app/`
2. **Build your components** in `src/components/`
3. **Define your API** in `src/store/services/`
4. **Add state management** in `src/store/slices/` as needed
5. **Test and iterate**

## 💡 Tips

- Keep the design system components - they'll speed up development
- The Redux setup is optional - use if you need global state
- All styling is done via Tailwind - leverage the utility classes
- SSR utilities in `src/lib/ssr/` are helpful for data fetching
- Use the `cn()` utility from `src/lib/utils.ts` for conditional classes

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

---

Happy building! 🎉
