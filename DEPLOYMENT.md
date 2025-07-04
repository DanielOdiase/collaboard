# Deployment Guide for Collaboard

## 🚀 Deploying to Vercel

### 1. Environment Variables Setup

Before deploying, you need to set up your Liveblocks environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variable:

```
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_live_your_production_key_here
```

### 2. Get Your Liveblocks Production Key

1. Go to [Liveblocks Dashboard](https://liveblocks.io/dashboard)
2. Create a new project or select existing one
3. Go to API Keys section
4. Copy your **Public Key** (starts with `pk_live_`)
5. Add it to Vercel environment variables

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel

# Or use the Vercel dashboard to connect your GitHub repo
```

### 4. Room Management Features

The app now includes smart room management:

- **Development**: Uses consistent room ID for testing
- **Production**: 
  - Checks URL parameters first (`?room=room-id`)
  - Falls back to localStorage for returning users
  - Generates new room ID for new users
  - Shows room info and share button

### 5. Sharing Rooms

Users can now:
- Click "Share Room" button to copy room URL
- Share the URL with others to collaborate
- Return to the same room using the URL

### 6. Troubleshooting

If you see "Loading..." indefinitely:

1. Check your Liveblocks API key is correct
2. Ensure the key has proper permissions
3. Check browser console for errors
4. Try refreshing the page

### 7. Production Checklist

- [ ] Liveblocks production API key set in Vercel
- [ ] Environment variable `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` configured
- [ ] Test room creation and sharing
- [ ] Verify real-time collaboration works
- [ ] Check mobile responsiveness

## 🔧 Local Development

For local development, the app uses:
- Development Liveblocks key (hardcoded)
- Consistent room ID: `collaboard-dev-room`

## 📱 Features Available

- ✅ Real-time collaboration
- ✅ Room sharing via URL
- ✅ Persistent room IDs
- ✅ Comment deletion
- ✅ Card editing
- ✅ Text highlighting with comments
- ✅ Loading states and error handling 