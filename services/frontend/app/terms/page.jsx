import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-4xl px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 28, 2025
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to GradPilot ("we," "our," or "us"). These Terms of
                  Service ("Terms") govern your use of our website and services
                  located at gradpilot.me (the "Service") operated by GradPilot.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By accessing or using our Service, you agree to be bound by
                  these Terms. If you disagree with any part of these terms,
                  then you may not access the Service.
                </p>
              </section>

              {/* Acceptance */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  2. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account, accessing, or using GradPilot, you
                  acknowledge that you have read, understood, and agree to be
                  bound by these Terms and our Privacy Policy. These Terms apply
                  to all visitors, users, and others who access or use the
                  Service.
                </p>
              </section>

              {/* Description of Service */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  3. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  GradPilot is a platform designed to help students navigate
                  their graduate school application process. Our services
                  include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>
                    University and program matching based on student profiles
                  </li>
                  <li>Professor and research opportunity discovery</li>
                  <li>Document review and feedback services</li>
                  <li>Mentorship connections and guidance</li>
                  <li>Scholarship and funding information</li>
                  <li>AI-powered application assistance</li>
                  <li>Community forums and discussion boards</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Account Creation
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To use certain features of our Service, you must register
                      for an account. You must provide accurate, complete, and
                      current information during the registration process and
                      keep your account information updated.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Account Security
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You are responsible for safeguarding your account
                      credentials and for all activities that occur under your
                      account. You must immediately notify us of any
                      unauthorized use of your account.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Account Types
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We offer different account types including Student
                      accounts and Mentor accounts. Each account type has
                      specific features and responsibilities as outlined in our
                      platform.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Conduct */}
              <section>
                <h2 className="text-2xl font-bold mb-4">5. User Conduct</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to use the Service only for lawful purposes and in
                    accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Violate any applicable laws or regulations</li>
                    <li>
                      Impersonate any person or entity or misrepresent your
                      affiliation
                    </li>
                    <li>
                      Upload, post, or transmit any content that is harmful,
                      threatening, abusive, or otherwise objectionable
                    </li>
                    <li>
                      Interfere with or disrupt the Service or servers connected
                      to the Service
                    </li>
                    <li>
                      Attempt to gain unauthorized access to any portion of the
                      Service
                    </li>
                    <li>
                      Use the Service for any commercial purpose without our
                      express written consent
                    </li>
                    <li>
                      Share false or misleading academic credentials or
                      achievements
                    </li>
                    <li>Harassment or bullying of other users</li>
                  </ul>
                </div>
              </section>

              {/* Content and Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  6. Content and Intellectual Property
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">User Content</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You retain ownership of any content you submit, post, or
                      display on the Service. By submitting content, you grant
                      us a worldwide, non-exclusive, royalty-free license to
                      use, reproduce, and distribute your content in connection
                      with the Service.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Platform Content
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The Service and its original content, features, and
                      functionality are owned by GradPilot and are protected by
                      international copyright, trademark, patent, trade secret,
                      and other intellectual property laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl font-bold mb-4">7. Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the Service, to
                  understand our practices regarding the collection and use of
                  your personal information.
                </p>
              </section>

              {/* Mentorship Services */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  8. Mentorship Services
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform facilitates connections between students and
                    mentors. Please note:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>
                      Mentors are independent individuals and not employees of
                      GradPilot
                    </li>
                    <li>
                      We do not guarantee the quality or outcome of mentorship
                      interactions
                    </li>
                    <li>
                      Users are responsible for their own interactions and
                      communications
                    </li>
                    <li>
                      We encourage respectful and professional communication at
                      all times
                    </li>
                  </ul>
                </div>
              </section>

              {/* AI Services Disclaimer */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  9. AI Services Disclaimer
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI-powered features are provided for informational and
                  assistance purposes only. While we strive for accuracy,
                  AI-generated content should not be considered as professional
                  advice. Users should verify all information and consult with
                  qualified professionals when making important academic
                  decisions.
                </p>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
                    BASIS. GRADPILOT EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY
                    KIND, WHETHER EXPRESS OR IMPLIED.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>
                      We do not guarantee admission to any educational
                      institution
                    </li>
                    <li>
                      We do not guarantee scholarship or funding opportunities
                    </li>
                    <li>
                      University and program information may change without
                      notice
                    </li>
                    <li>
                      We are not responsible for decisions made by educational
                      institutions
                    </li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  11. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IN NO EVENT SHALL GRADPILOT BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE
                  OF THE SERVICE.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account and bar access to
                    the Service immediately, without prior notice or liability,
                    under our sole discretion, for any reason whatsoever,
                    including without limitation if you breach the Terms.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You may terminate your account at any time by contacting us
                    or through your account settings.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will provide at least 30
                  days notice prior to any new terms taking effect. What
                  constitutes a material change will be determined at our sole
                  discretion.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold mb-4">14. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of
                  [Your Jurisdiction], without regard to its conflict of law
                  provisions. Our failure to enforce any right or provision of
                  these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  15. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Email:</strong> support@gradpilot.me
                    <br />
                    <strong>Website:</strong> https://gradpilot.me
                  </p>
                </div>
              </section>

              {/* Acknowledgment */}
              <section className="border-t pt-6">
                <p className="text-muted-foreground leading-relaxed text-center">
                  By using GradPilot, you acknowledge that you have read and
                  understood these Terms of Service and agree to be bound by
                  them.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 mt-8">
            <Link
              href="/privacy"
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="text-primary hover:underline font-medium"
            >
              About Us
            </Link>
            <Link href="/" className="text-primary hover:underline font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">GradPilot</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline" href="/terms">
              Terms of Service
            </Link>
            <Link
              className="text-sm font-medium hover:underline"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/about">
              About
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            © 2025 GradPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
