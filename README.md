# Carabiner – A Queer Community Calendar

**Carabiner** is a multilingual web app designed to help the queer community of Montréal discover, share, and connect through events. Named after the climbing tool that links things together, Carabiner aims to build bridges within the community — one event at a time.

## ✨ What It Does

- **Event Discovery**: Browse upcoming events in a clean, date-organized feed.  
- **Multilingual Support**: The app is now available in French, English and Spanish (with Mexican terminology), including all event content.
- **Community Contributions**: Anyone can submit an event. Submissions go through moderation before being published.  
- **Rich Event Cards**: Events include images, time, location, and multilingual descriptions.
- **Built for Mobile & Desktop**: The interface is responsive, smooth, and accessible.
- **Installable**: On mobile devices, a banner invites you to install the web app for quick access.

## 🛠 Tech Stack

- **Frontend**: Next.js (React + TypeScript), Tailwind CSS, Framer Motion for animations  
- **Backend**: Supabase (database + image storage) with honeypot fields and rate limiting to prevent spam
- **Hosting**: Ideal for Vercel, but can run anywhere that supports Node.js  

## 🚀 Getting Started (Local Setup)

1. **Clone the Repo**  
   ```bash
   git clone https://github.com/mtldev514/carabiner.git
   cd carabiner
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the Dev Server**  
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 🌈 Why It Matters

Carabiner was created by a queer, non-binary DevOps engineer and artist to serve the queer and BIPOC communities. It’s not just a tech project — it’s an act of care. Every decision is made with inclusion, simplicity, and connection in mind.

This is version **0.1.0** — a first step. Contributions, ideas, and feedback are welcome.

## 🔗 Links

- [Vercel](https://vercel.com) – for simple, scalable Next.js deployments  
- [Supabase](https://supabase.com) – the backend-as-a-service powering our database and image storage  



❤️‍🔥 Made with ❤️ and 🤖 in MTL. All art is human.
