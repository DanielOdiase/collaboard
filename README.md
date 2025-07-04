# 📝 CollabBoard – Real-Time Collaborative Notes App

**CollabBoard** is a real-time collaborative note-taking app built with [Next.js](https://nextjs.org/), [Liveblocks](https://liveblocks.io/), and [Tailwind CSS](https://tailwindcss.com/) and [VELT](https://velt.dev/). Inspired by tools like Google Docs and Figma, this demo allows multiple users to add notes, see who's online, and collaborate live — all from inside the same web page.

> Built as a technical showcase for roles involving Solutions Engineering, SDK integration, and client-facing support.

---

## Tech Stack

- **Next.js (TypeScript)** – Modern React framework
- - **Velt** – Drop-in collaboration toolkit for adding comments, cursors, and presence
- **Liveblocks** – Real-time collaboration SDK
- **Tailwind CSS** – Utility-first styling
- **Vercel** – Deployment platform
- **GitHub** – Version control
  

---

##  Features

-  Add notes in real-time
-  See how many users are online
-  Shared state across users (Liveblocks `LiveList`)
-  Clean, accessible UI
-  Easily extendable into a full collaborative tool
-  **Velt Integration** - Comments, screen recording, and notifications

---

## 🚧 Challenges Faced: Velt Authentication

When integrating Velt for comments and presence, the UI loaded, but the browser console showed authentication errors like:

```
Velt:  Velt sdk not authenticated.
Velt:  Error in identify:  Missing userId in config data.
Velt:  Error in initializeClient:  Error: OrganizationId is not set in Identify method
```

### Debugging & Solution

- **Initial Issue:**
  - The VeltProvider and UI rendered, but the SDK was not authenticating users due to missing required fields in the `useIdentify` call.
  - The documentation had changed, and now `organizationId` is required in addition to `userId` and `name`.

- **What I Did:**
  - Re-read the [Velt authentication docs](https://docs.velt.dev/get-started/setup/authenticate).
  - Updated the code to always provide a valid `userId`, `name`, and a default `organizationId`.
  - Ensured `useIdentify` is called in a dedicated child component of `VeltProvider`.

### Before (❌ Incorrect)
```tsx
// Called useIdentify without organizationId
useIdentify({
  userId,
  name,
});
```

### After (✅ Correct)
```tsx
// Called useIdentify with required organizationId
useIdentify({
  userId: String(userId),
  name: String(name),
  organizationId: 'default-org', // Required by Velt
});
```

**Result:**
- The authentication errors disappeared, and Velt features (comments, presence, etc.) worked as expected.
- Lesson: Always check for required fields in SDK updates and follow the latest documentation closely!

---

## 🔧 Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/collabboard.git
   cd collabboard
