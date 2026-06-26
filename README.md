<div align="center">
  
  # 🎨 ArtHub

  **A premium marketplace to discover, share, and appreciate stunning artworks from independent artists.**

  [![Live Site](https://img.shields.io/badge/Live_Site-View_Now-fuchsia?style=for-the-badge&logo=vercel)](https://arthub-client-liart.vercel.app)

</div>

---

## 📌 Overview

ArtHub is a global community platform designed for digital artists, photographers, and creatives to showcase their original masterpieces. Users can explore galleries, search by category and price, connect with visionary artists, and purchase exclusive artworks securely.

🌐 **Live Demo:** [https://arthub-client-liart.vercel.app](https://arthub-client-liart.vercel.app)

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔐 **Authentication** | Secure email & password login, registration, and user session management via `better-auth`. |
| 🖼️ **Dynamic Gallery** | Interactive artwork sliders using `swiper` with advanced search, category filtering, and price range sorting. |
| 💳 **Secure Payments** | Integrated checkout and payment processing capabilities using `stripe`. |
| 📊 **User Dashboard** | Dedicated artist and user dashboards featuring data visualization using `recharts`. |
| 🎨 **Premium UI/UX** | Stunning, responsive design with smooth animations (`motion`), full dark/light mode (`next-themes`), built on Tailwind CSS v4 and HeroUI. |

---

## 🛠️ Detailed Technology Stack & Packages

### Frontend Core
- **Next.js 15+** (App Router)
- **React 19**
- **JavaScript** (ES6+)

### Styling & Animation
- **Tailwind CSS v4** (Utility-first styling with native semantic tokens)
- **HeroUI** (Accessible, beautiful UI components)
- **Framer Motion (`motion`)** (Smooth page and component animations)
- **Swiper** (Modern touch sliders for artwork galleries)

### Icons & Notifications
- **Lucide React** (Clean, minimalist icons)
- **React Icons** (Comprehensive icon library)
- **React Hot Toast** (Toast notifications for user actions)

### Forms, Data & Charts
- **React Hook Form** (Performant, flexible, and extensible forms)
- **Recharts** (Composable charting library for dashboards)
- **MongoDB** (Database integration for adapters)

### Authentication & Payments
- **Better-Auth** (Robust session tracking and JWT management)
- **Stripe & @stripe/stripe-js** (Secure payment infrastructure)

---

## ⚙️ Local Setup Instructions

To run ArtHub locally, follow these direct steps:

1. **Clone the repository** to your local machine.
2. **Install dependencies** by running `npm install` in your terminal.
3. **Configure environment variables** by creating a `.env` file containing required API keys, database URIs, Stripe keys, and `NEXT_PUBLIC_BETTER_AUTH_URL` pointing to your local server instance.
4. **Start the development server** by running `npm run dev`.
5. **View the site** by opening `http://localhost:3000` in your web browser.
