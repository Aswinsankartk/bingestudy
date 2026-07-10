import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-black tracking-tight text-black">
          BingeStudy
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold text-black border border-gray-200 px-5 py-2 rounded-full hover:border-black transition-all duration-200"
        >
          Login
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block mb-3">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>

        <div className="prose max-w-none">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using BingeStudy ("the Platform", "we", "us", or
              "our"), you agree to be bound by these Terms of Service. If you do
              not agree to these terms, please do not use the platform.
              BingeStudy is a collaborative study platform designed for students
              to share resources and communicate in real time.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 13 years of age to use BingeStudy. By using
              the platform, you represent and warrant that you meet this age
              requirement. If you are under 18, you represent that you have your
              parent or guardian's permission to use the platform.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              You may create an account using Google OAuth or email and
              password. You are responsible for:
            </p>
            <ul>
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activity that occurs under your account</li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
              <li>
                Providing accurate and complete information during registration
              </li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms or that have been inactive for an extended period.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>
              You agree to use BingeStudy only for lawful purposes. You must
              not:
            </p>
            <ul>
              <li>
                Upload, share, or transmit any content that is illegal, harmful,
                threatening, abusive, defamatory, or otherwise objectionable
              </li>
              <li>Share copyrighted material without proper authorization</li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation
              </li>
              <li>
                Upload files containing malware, viruses, or any malicious code
              </li>
              <li>
                Attempt to gain unauthorized access to other accounts or systems
              </li>
              <li>
                Use the platform to send spam, unsolicited messages, or engage
                in harassment
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                platform
              </li>
              <li>
                Scrape, crawl, or extract data from the platform without
                permission
              </li>
            </ul>
          </Section>

          <Section title="5. Study Groups and Content">
            <p>
              BingeStudy allows users to create private study groups and share
              content including text messages, images, PDFs, audio files,
              documents, and URLs. You retain ownership of the content you
              upload. However, by uploading content to the platform, you grant
              BingeStudy a non-exclusive, royalty-free license to store,
              display, and transmit that content solely for the purpose of
              operating the platform.
            </p>
            <p>
              Group administrators are responsible for managing their groups and
              ensuring that content shared within their groups complies with
              these terms. BingeStudy reserves the right to remove any content
              that violates these terms.
            </p>
          </Section>

          <Section title="6. AI Assistant">
            <p>
              BingeStudy integrates Google Gemini 2.5 Flash to provide an
              AI-powered study assistant. Please be aware that:
            </p>
            <ul>
              <li>
                AI responses are generated automatically and may not always be
                accurate
              </li>
              <li>
                The AI assistant is intended to supplement, not replace,
                professional academic guidance
              </li>
              <li>
                You should verify important information from authoritative
                sources
              </li>
              <li>
                Do not share sensitive personal information with the AI
                assistant
              </li>
              <li>
                Conversation history is stored per user per group for continuity
              </li>
            </ul>
          </Section>

          <Section title="7. Privacy and Data">
            <p>
              Your use of BingeStudy is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-black underline hover:opacity-70 transition-opacity"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using
              the platform, you consent to the collection and use of your
              information as described in the Privacy Policy.
            </p>
          </Section>

          <Section title="8. File Storage and Uploads">
            <p>
              Files uploaded to BingeStudy are stored using Supabase Storage.
              You are responsible for ensuring you have the right to share any
              files you upload. We reserve the right to remove files that
              violate these terms. Individual file uploads are limited to 10MB.
              We do not guarantee permanent storage of uploaded files.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              The BingeStudy platform, including its design, code, logo, and all
              content created by us, is owned by BingeStudy and protected by
              applicable intellectual property laws. You may not copy, modify,
              distribute, or create derivative works based on the platform
              without our express written permission.
            </p>
          </Section>

          <Section title="10. Disclaimer of Warranties">
            <p>
              BingeStudy is provided on an "as is" and "as available" basis
              without warranties of any kind, either express or implied. We do
              not warrant that the platform will be uninterrupted, error-free,
              or free of viruses or other harmful components. We do not warrant
              the accuracy, completeness, or usefulness of any content on the
              platform, including AI-generated responses.
            </p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, BingeStudy shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or relating to your use of the
              platform, including but not limited to loss of data, loss of
              profits, or interruption of service.
            </p>
          </Section>

          <Section title="12. Termination">
            <p>
              We reserve the right to suspend or terminate your access to
              BingeStudy at any time, with or without notice, for any reason
              including violation of these terms. Upon termination, your right
              to use the platform will immediately cease. You may also delete
              your account at any time by contacting us.
            </p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>
              We may update these Terms of Service from time to time. We will
              notify users of significant changes by updating the date at the
              top of this page. Your continued use of the platform after changes
              are posted constitutes your acceptance of the revised terms.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of India, without regard to its conflict
              of law provisions. Any disputes arising under these terms shall be
              subject to the exclusive jurisdiction of the courts located in
              India.
            </p>
          </Section>

          <Section title="15. Contact Us">
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a
                  href="mailto:bingestudy.app@gmail.com"
                  className="text-black underline hover:opacity-70 transition-opacity"
                >
                  bingestudy.app@gmail.com
                </a>
              </li>
              <li>
                Website:{" "}
                <Link
                  href="/"
                  className="text-black underline hover:opacity-70 transition-opacity"
                >
                  bingestudy.vercel.app
                </Link>
              </li>
            </ul>
          </Section>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-10 py-6 bg-black mt-16">
        <span className="text-sm font-black text-white">BingeStudy</span>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <span className="text-xs text-gray-500">
          © 2026 BingeStudy. Built for students.
        </span>
      </footer>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-black text-black mb-3">{title}</h2>
      <div className="text-gray-500 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
