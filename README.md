# Telegram Mini Shop App

A modern, production-ready e-commerce mini app built specifically for Telegram using Vue 3, Vite, and Tailwind CSS.

## ✨ Features

- 🛍️ **Product Browsing**: Grid view with category filtering and search
- 🔍 **Search**: Real-time product search with clear UI
- 📱 **Mobile-First**: Optimized for mobile viewing within Telegram
- 🎨 **Theme Support**: Automatic dark/light theme switching based on Telegram settings
- 🛒 **Shopping Cart**: Add, remove, and update quantities
- ❤️ **Favorites**: Save favorite products for later
- 📦 **Order Management**: Place orders and view order history
- 🎯 **Telegram Integration**: Uses MainButton, BackButton, haptic feedback
- 🎭 **Smooth Animations**: Subtle, professional animations throughout
- 💾 **Persistent Storage**: Cart and favorites saved locally
- 🌐 **Multi-language**: Language selector in profile

## 🚀 Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Telegram WebApp SDK** - Native Telegram features

## 📁 Project Structure

```
telegram-mini-shop/
├── src/
│   ├── assets/           # Styles and static assets
│   │   └── main.css      # Main CSS with Tailwind
│   ├── components/       # Reusable Vue components
│   │   ├── AdSlider.vue
│   │   ├── BottomNavigation.vue
│   │   ├── CartItem.vue
│   │   ├── CategoryChips.vue
│   │   ├── ProductCard.vue
│   │   ├── QuantitySelector.vue
│   │   └── SearchBar.vue
│   ├── pages/           # Route-based page components
│   │   ├── HomePage.vue
│   │   ├── ProductPage.vue
│   │   ├── CartPage.vue
│   │   ├── CheckoutPage.vue
│   │   ├── ProfilePage.vue
│   │   ├── OrdersPage.vue
│   │   └── FavoritesPage.vue
│   ├── stores/          # Pinia stores
│   │   ├── cart.js
│   │   ├── product.js
│   │   └── user.js
│   ├── services/        # API and utility services
│   │   ├── api.js       # Backend API integration
│   │   └── telegram.js  # Telegram WebApp SDK wrapper
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Installation

1. **Clone or download the project**

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file** (optional):
```bash
cp .env.example .env
```

Edit `.env` and add your API URL:
```env
VITE_API_URL=https://your-api-url.com
```

4. **Run development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

5. **Build for production**:
```bash
npm run build
```

## 🔗 Backend API Integration

The app expects the following API endpoints:

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/search?q=query` - Search products

### Categories
- `GET /categories` - Get all categories

### Orders
- `POST /orders` - Create new order
- `GET /orders/:userId` - Get user's orders

### Favorites
- `GET /users/:userId/favorites` - Get favorites
- `POST /users/:userId/favorites` - Add favorite
- `DELETE /users/:userId/favorites/:productId` - Remove favorite

### Request Headers
All requests include:
```
X-Telegram-Init-Data: <telegram_init_data>
```

## 🎯 Features Overview

### Home Screen
- Top navbar with shop icon and theme toggle
- Search bar below navbar
- Auto-playing advertisement slider (reduced height)
- Category chips for filtering
- Product grid (2 columns)
- Each product card shows: image, name, price, discount badge, favorite button, rating

### Product Detail Screen
- Image slider (1-5 images)
- Product name and pricing
- Discount badge if applicable
- Stock status
- Rating display
- Description section
- Expandable "More Details"
- Quantity selector
- Sticky "Add to Cart" button

### Cart Screen
- List of cart items with thumbnails
- Quantity controls per item
- Remove item option
- Real-time total calculation
- Clear all button
- Order summary
- Checkout button

### Checkout Screen
- Auto-filled user info from Telegram
- Phone number input
- Delivery address textarea
- Notes field
- Order summary with item list
- Payment method selection
- Confirm order button

### Profile Screen
- User avatar and info
- Quick stats (orders, favorites)
- Menu items:
  - Order History
  - Favorites
- Settings:
  - Theme toggle
  - Language selector
- App version info

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with subtle shadows and rounded corners
- **Animations**: Fade-in, slide-up, scale-in effects with staggered delays
- **Typography**: Plus Jakarta Sans for headings, Inter for body text
- **Colors**: Telegram blue (#2AABEE) as primary color
- **Dark Mode**: Full dark mode support with Telegram theme integration
- **Touch Optimized**: Large tap targets, smooth interactions
- **Haptic Feedback**: Tactile feedback for user actions

## 📱 Telegram Integration

### SDK Features Used
- `MainButton` - For checkout and primary actions
- `BackButton` - For navigation
- `themeParams` - Theme color synchronization
- `HapticFeedback` - Touch feedback
- `user` data - Auto-fill user information
- Theme change detection

### Testing in Telegram

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up a Web App via BotFather
4. Use [@WebAppDebugBot](https://t.me/WebAppDebugBot) for testing
5. Or use ngrok to expose local server:
```bash
ngrok http 5173
```

## 🔧 Configuration

### Tailwind Configuration
Customize colors, fonts, and design tokens in `tailwind.config.js`

### Router Configuration
Add or modify routes in `src/router/index.js`

### API Service
Update API endpoints and mock data in `src/services/api.js`

## 📦 Mock Data

The app includes mock data for development:
- 12 sample products across 4 categories
- Sample order history
- Category icons and filters

Replace mock data with real API calls in production.

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome 80+
- Telegram in-app browser

## 🎯 Key Components

### ProductCard
Displays product with image, name, price, discount badge, favorite button, and rating

### SearchBar
Search input with clear button and optional suggestions

### CategoryChips
Horizontal scrolling category filters

### AdSlider
Auto-playing advertisement carousel

### CartItem
Cart item with quantity controls and remove option

### QuantitySelector
Number input with increment/decrement buttons

### BottomNavigation
Sticky bottom navigation with Home, Cart, and Profile

## 📝 Development Notes

- All components use Vue 3 Composition API
- State management via Pinia stores
- Responsive design with Tailwind utilities
- Mobile-first approach
- Optimized for Telegram viewport
- Local storage for persistence

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

3. Configure your Telegram bot to use the deployed URL

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact via Telegram.

---

Built with ❤️ for the Telegram community
