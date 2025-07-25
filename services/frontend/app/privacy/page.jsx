import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-4 mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">Privacy Policy</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          GradPilot is committed to protecting your privacy. This page explains
          how we collect, use, and safeguard your personal information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          Information We Collect
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>Your name, email address, and profile information</li>
          <li>Messages and conversations with mentors or other users</li>
          <li>Application documents you upload or review</li>
          <li>Usage data and analytics to improve our services</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>To provide and improve GradPilot services</li>
          <li>To connect you with mentors, universities, and scholarships</li>
          <li>To send notifications and updates</li>
          <li>To personalize your experience</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          How We Protect Your Data
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>We use secure servers and encryption</li>
          <li>We do not sell your personal information to third parties</li>
          <li>
            Access to your data is restricted to authorized personnel only
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Your Choices</h2>
        <ul className="list-disc list-inside mb-6">
          <li>You can update or delete your account information at any time</li>
          <li>You can contact us to request deletion of your data</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
        <p className="mb-6">
          If you have any questions about our privacy policy, please email us at{" "}
          <a
            href="mailto:support@gradpilot.me"
            className="text-primary underline"
          >
            support@gradpilot.me
          </a>
        </p>
        <div className="mt-12 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} GradPilot. All rights reserved.
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-primary underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
