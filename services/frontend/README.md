# GradPilot Frontend

This is the frontend of **GradPilot**, a platform designed to assist students with postgraduate applications, scholarships, and academic planning. Built with **Next.js**, **TailwindCSS**, and **Radix UI** components.

---

## 🚀 Features

- Responsive UI with TailwindCSS
- Modular component architecture
- Dynamic form handling with React Hook Form + Zod
- Charts with Recharts
- Modern UI elements using Radix UI
- Theme switching with `next-themes`

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🧪 Local Development

### Prerequisites

- **Node.js** `>=18.18.0`
- **npm** `>=9.x`
- [**Docker**](https://www.docker.com/) (optional, for containerization)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build Docker image
docker build -t gradpilot-frontend .

# Run container
docker run -p 3000:3000 gradpilot-frontend
```
