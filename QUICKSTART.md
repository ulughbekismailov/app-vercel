# Quick Start Guide - Telegram Mini Shop

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
cd telegram-mini-shop
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Your app will be running at `http://localhost:5173`

### Step 3: Test in Browser
Open `http://localhost:5173` in your browser. The app will work with mock data.

---

## 🧪 Testing in Telegram

### Option A: Using ngrok (Recommended for local testing)

1. Install ngrok: https://ngrok.com/download

2. Start your dev server:
```bash
npm run dev
```

3. In another terminal, expose your local server:
```bash
ngrok http 5173
```

4. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)

5. Create a bot via [@BotFather](https://t.me/botfather):
   - Send `/newbot`
   - Choose a name and username
   - Get your bot token

6. Set up Web App:
   - Send `/newapp` to BotFather
   - Select your bot
   - Enter app title and description
   - Enter your ngrok URL
   - Upload an app icon (optional)

7. Open your bot in Telegram and test!

### Option B: Deploy to Production

1. Build the project:
```bash
npm run build
```

2. Deploy `dist` folder to:
   - **Vercel**: `npx vercel deploy`
   - **Netlify**: Drag and drop `dist` folder
   - **GitHub Pages**: Push to gh-pages branch

3. Use your deployment URL in BotFather's Web App setup

---

## 🎯 Key Features to Test

1. **Browse Products**
   - Scroll through product grid
   - Click on products to view details
   - Use category chips to filter

2. **Search**
   - Type in search bar
   - See filtered results

3. **Add to Cart**
   - Click "Add to Cart" on product page
   - Adjust quantity before adding

4. **Cart Management**
   - View cart items
   - Change quantities
   - Remove items

5. **Checkout**
   - Fill in delivery details
   - Place order

6. **Favorites**
   - Click heart icon on products
   - View favorites from profile

7. **Theme Toggle**
   - Toggle between light and dark mode
   - Theme syncs with Telegram

---

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  telegram: {
    blue: '#2AABEE',  // Change this
    // ...
  }
}
```

### Add Products
Edit `src/services/api.js` → `getMockProducts()` method

### Update API
Replace mock data with real API calls in `src/services/api.js`

### Modify Pages
All pages are in `src/pages/` - edit as needed

---

## 📱 Telegram Features

### MainButton
Used automatically on:
- Checkout page for "Confirm Order"

### BackButton
Appears automatically on:
- Product details
- Checkout
- Order history
- Favorites

### Haptic Feedback
Triggers on:
- Button clicks
- Add to cart
- Favorite toggle
- Navigation

---

## 🐛 Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 5174,  // Change here
}
```

### Telegram SDK Not Working
Make sure you're testing in Telegram or using the web debugger.
The app falls back to mock user data when not in Telegram.

### Styles Not Loading
Run:
```bash
npm install
npm run dev
```

### Build Errors
Clear cache and rebuild:
```bash
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

## 📚 Next Steps

1. **Connect Real API**
   - Update `VITE_API_URL` in `.env`
   - Implement actual endpoints

2. **Add Payment**
   - Integrate Telegram Payments
   - Or connect to Stripe/PayPal

3. **Enhanced Features**
   - Product reviews
   - Wishlist sharing
   - Order tracking
   - Push notifications

4. **Localization**
   - Add more languages
   - Translate all strings

5. **Analytics**
   - Track user behavior
   - Monitor conversions

---

## 💡 Tips

- **Performance**: Images are lazy-loaded
- **SEO**: Not applicable for Telegram Mini Apps
- **Mobile**: Optimized for mobile by default
- **Testing**: Use Chrome DevTools mobile emulator
- **Debugging**: Check browser console for logs

---

## 🎨 Design System

- **Spacing**: 8px system (multiples of 8)
- **Corners**: 12px for cards, 8px for buttons
- **Shadows**: Soft, elevated
- **Typography**: Plus Jakarta Sans + Inter
- **Colors**: Telegram blue primary

---

## ✅ Production Checklist

Before deploying:
- [ ] Update API URLs in `.env`
- [ ] Test all user flows
- [ ] Check mobile responsiveness
- [ ] Test dark mode
- [ ] Verify Telegram integration
- [ ] Test on actual devices
- [ ] Set up error tracking
- [ ] Configure analytics
- [ ] Review security
- [ ] Optimize images

---

Need help? Check the README.md or open an issue!

Happy coding! 🚀
