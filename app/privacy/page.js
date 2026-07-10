import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "BingeStudy's privacy policy — how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://bingestudy.vercel.app/privacy",
  },
};

const sections = [
  { id: "infocollect", title: "1. What Information Do We Collect?" },
  { id: "infouse", title: "2. How Do We Process Your Information?" },
  {
    id: "whoshare",
    title: "3. When And With Whom Do We Share Your Personal Information?",
  },
  { id: "ai", title: "4. Do We Offer Artificial Intelligence-Based Products?" },
  { id: "sociallogins", title: "5. How Do We Handle Your Social Logins?" },
  { id: "inforetain", title: "6. How Long Do We Keep Your Information?" },
  { id: "infosafe", title: "7. How Do We Keep Your Information Safe?" },
  { id: "privacyrights", title: "8. What Are Your Privacy Rights?" },
  { id: "dnt", title: "9. Controls For Do-Not-Track Features" },
  { id: "policyupdates", title: "10. Do We Make Updates To This Notice?" },
  { id: "contact", title: "11. How Can You Contact Us About This Notice?" },
  {
    id: "request",
    title:
      "12. How Can You Review, Update, Or Delete The Data We Collect From You?",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ============ NAVBAR ============ */}
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

      {/* ============ HEADER ============ */}
      <section className="px-6 md:px-10 pt-16 pb-10 max-w-3xl mx-auto">
        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm">Last updated July 04, 2026</p>
      </section>

      {/* ============ INTRO ============ */}
      <section className="px-6 md:px-10 max-w-3xl mx-auto text-gray-600 text-sm leading-relaxed space-y-4">
        <p>
          This Privacy Notice for BingeStudy (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) describes how and why we might
          access, collect, store, use, and/or share your personal information
          when you use our services, including when you visit our website, or
          engage with us in other related ways, including any marketing or
          events.
        </p>
        <p>
          <strong className="text-black">Questions or concerns?</strong> Reading
          this Privacy Notice will help you understand your privacy rights and
          choices. If you do not agree with our policies and practices, please
          do not use our Services. If you still have any questions or concerns,
          please contact us at{" "}
          <a
            href="mailto:bingestudy.app@gmail.com"
            className="text-black underline underline-offset-2"
          >
            bingestudy.app@gmail.com
          </a>
          .
        </p>
      </section>

      {/* ============ TABLE OF CONTENTS ============ */}
      <section className="px-6 md:px-10 py-10 max-w-3xl mx-auto">
        <div className="border border-gray-100 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="px-6 md:px-10 pb-20 max-w-3xl mx-auto text-gray-600 text-sm leading-relaxed">
        <PolicySection
          id="infocollect"
          title="1. What Information Do We Collect?"
        >
          <h3 className="font-bold text-black text-base mb-2">
            Personal information you disclose to us
          </h3>
          <p className="mb-4">
            <em>
              In Short: We collect personal information that you provide to us.
            </em>
          </p>
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us
            when you register on the Services, express an interest in obtaining
            information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you
            contact us.
          </p>
          <p className="mb-2 font-semibold text-black">
            Personal Information Provided by You. The personal information we
            collect may include:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Names</li>
            <li>Email addresses</li>
            <li>Passwords</li>
            <li>Contact or authentication data</li>
          </ul>
          <p className="mb-4">
            <strong className="text-black">Sensitive Information.</strong> We do
            not process sensitive information.
          </p>
          <p className="mb-4">
            <strong className="text-black">Social Media Login Data.</strong> We
            may provide you with the option to register with us using your
            existing social media account details. If you choose to register
            this way, we will collect certain profile information about you from
            the social media provider, as described in the section below on
            social logins.
          </p>
          <p className="mb-4">
            All personal information that you provide to us must be true,
            complete, and accurate, and you must notify us of any changes to
            such personal information.
          </p>
          <h3 className="font-bold text-black text-base mb-2">Google API</h3>
          <p>
            Our use of information received from Google APIs will adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2"
            >
              Google API Services User Data Policy
            </a>
            , including the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2"
            >
              Limited Use requirements
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection
          id="infouse"
          title="2. How Do We Process Your Information?"
        >
          <p className="mb-4">
            <em>
              In Short: We process your information to provide, improve, and
              administer our Services, communicate with you, for security and
              fraud prevention, and to comply with law. We may also process your
              information for other purposes with your consent.
            </em>
          </p>
          <p className="mb-2 font-semibold text-black">
            We process your personal information for a variety of reasons,
            including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-black">
                To facilitate account creation and authentication
              </strong>{" "}
              and otherwise manage user accounts, so you can create and log in
              to your account and keep it in working order.
            </li>
            <li>
              <strong className="text-black">
                To respond to user inquiries/offer support
              </strong>{" "}
              and solve any potential issues you might have with the requested
              service.
            </li>
            <li>
              <strong className="text-black">To request feedback</strong> and
              contact you about your use of our Services.
            </li>
            <li>
              <strong className="text-black">
                To evaluate and improve our Services, products, marketing, and
                your experience.
              </strong>
            </li>
            <li>
              <strong className="text-black">To identify usage trends</strong>{" "}
              and better understand how our Services are being used.
            </li>
          </ul>
        </PolicySection>

        <PolicySection
          id="whoshare"
          title="3. When And With Whom Do We Share Your Personal Information?"
        >
          <p className="mb-4">
            <em>
              In Short: We may share information in specific situations
              described in this section and/or with specific third parties.
            </em>
          </p>
          <p>
            We may need to share your personal information in the following
            situations:{" "}
            <strong className="text-black">Business Transfers.</strong> We may
            share or transfer your information in connection with, or during
            negotiations of, any merger, sale of company assets, financing, or
            acquisition of all or a portion of our business to another company.
          </p>
        </PolicySection>

        <PolicySection
          id="ai"
          title="4. Do We Offer Artificial Intelligence-Based Products?"
        >
          <p className="mb-4">
            <em>
              In Short: We offer products, features, or tools powered by
              artificial intelligence, machine learning, or similar
              technologies.
            </em>
          </p>
          <p className="mb-4">
            As part of our Services, we offer products, features, or tools
            powered by artificial intelligence, machine learning, or similar
            technologies (&ldquo;AI Products&rdquo;). These tools are designed
            to enhance your experience and provide you with innovative
            solutions.
          </p>
          <h3 className="font-bold text-black text-base mb-2">
            Use of AI Technologies
          </h3>
          <p className="mb-4">
            We provide the AI Products through third-party service providers
            (&ldquo;AI Service Providers&rdquo;), including Google Cloud AI.
            Your input, output, and personal information will be shared with and
            processed by these AI Service Providers to enable your use of our AI
            Products. You must not use the AI Products in any way that violates
            the terms or policies of any AI Service Provider.
          </p>
          <h3 className="font-bold text-black text-base mb-2">
            Our AI Products
          </h3>
          <p className="mb-4">
            Our AI Products are designed for the following functions:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>AI bots</li>
          </ul>
          <h3 className="font-bold text-black text-base mb-2">
            How We Process Your Data Using AI
          </h3>
          <p>
            All personal information processed using our AI Products is handled
            in line with this Privacy Notice and our agreements with third
            parties, to safeguard your personal information throughout the
            process.
          </p>
        </PolicySection>

        <PolicySection
          id="sociallogins"
          title="5. How Do We Handle Your Social Logins?"
        >
          <p className="mb-4">
            <em>
              In Short: If you choose to register or log in using a social media
              account, we may have access to certain information about you.
            </em>
          </p>
          <p className="mb-4">
            Our Services offer you the ability to register and log in using your
            third-party social media account details. Where you choose to do
            this, we will receive certain profile information about you from
            your social media provider — often including your name, email
            address, and profile picture, as well as other information you
            choose to make public on that platform.
          </p>
          <p>
            We will use the information we receive only for the purposes
            described in this Privacy Notice. We do not control, and are not
            responsible for, other uses of your personal information by your
            third-party social media provider. We recommend reviewing their
            privacy notice as well.
          </p>
        </PolicySection>

        <PolicySection
          id="inforetain"
          title="6. How Long Do We Keep Your Information?"
        >
          <p className="mb-4">
            <em>
              In Short: We keep your information for as long as necessary to
              fulfill the purposes outlined in this Privacy Notice unless
              otherwise required by law.
            </em>
          </p>
          <p className="mb-4">
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this Privacy Notice, unless a
            longer retention period is required by law. No purpose in this
            notice will require us to keep your personal information for longer
            than the period of time in which you have an account with us.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize it, or, if
            this is not possible, we will securely store it and isolate it from
            further processing until deletion is possible.
          </p>
        </PolicySection>

        <PolicySection
          id="infosafe"
          title="7. How Do We Keep Your Information Safe?"
        >
          <p className="mb-4">
            <em>
              In Short: We aim to protect your personal information through a
              system of organizational and technical security measures.
            </em>
          </p>
          <p>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, no electronic transmission over the
            internet or information storage technology can be guaranteed to be
            100% secure, so we cannot promise that unauthorized third parties
            will never be able to defeat our security. You should only access
            the Services within a secure environment.
          </p>
        </PolicySection>

        <PolicySection
          id="privacyrights"
          title="8. What Are Your Privacy Rights?"
        >
          <p className="mb-4">
            <em>
              In Short: You may review, change, or terminate your account at any
              time, depending on your country, province, or state of residence.
            </em>
          </p>
          <p className="mb-4">
            <strong className="text-black">Withdrawing your consent:</strong> If
            we are relying on your consent to process your personal information,
            you have the right to withdraw your consent at any time by
            contacting us using the details in the &ldquo;How Can You Contact
            Us&rdquo; section below. This will not affect the lawfulness of
            processing conducted before your withdrawal.
          </p>
          <h3 className="font-bold text-black text-base mb-2">
            Account Information
          </h3>
          <p className="mb-4">
            If you would like to review, change, or terminate your account at
            any time, contact us using the contact information provided. Upon
            your request to terminate your account, we will deactivate or delete
            your account and information from our active databases. We may
            retain some information in our files to prevent fraud, troubleshoot
            problems, assist with investigations, enforce our legal terms,
            and/or comply with applicable legal requirements.
          </p>
          <p>
            If you have questions or comments about your privacy rights, you may
            email us at{" "}
            <a
              href="mailto:bingestudy.app@gmail.com"
              className="text-black underline underline-offset-2"
            >
              bingestudy.app@gmail.com
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection id="dnt" title="9. Controls For Do-Not-Track Features">
          <p>
            Most web browsers and some mobile operating systems include a
            Do-Not-Track (&ldquo;DNT&rdquo;) feature you can activate to signal
            your privacy preference not to have data about your online browsing
            activities monitored and collected. No uniform technology standard
            for recognizing and implementing DNT signals has been finalized, so
            we do not currently respond to DNT browser signals. If a standard
            for online tracking is adopted that we must follow, we will inform
            you in a revised version of this Privacy Notice.
          </p>
        </PolicySection>

        <PolicySection
          id="policyupdates"
          title="10. Do We Make Updates To This Notice?"
        >
          <p className="mb-4">
            <em>
              In Short: Yes, we will update this notice as necessary to stay
              compliant with relevant laws.
            </em>
          </p>
          <p>
            We may update this Privacy Notice from time to time. The updated
            version will be indicated by an updated &ldquo;Last updated&rdquo;
            date at the top of this Privacy Notice. If we make material changes,
            we may notify you by prominently posting a notice of such changes or
            by directly sending you a notification. We encourage you to review
            this Privacy Notice frequently.
          </p>
        </PolicySection>

        <PolicySection
          id="contact"
          title="11. How Can You Contact Us About This Notice?"
        >
          <p className="mb-4">
            If you have questions or comments about this notice, you may email
            us at{" "}
            <a
              href="mailto:bingestudy.app@gmail.com"
              className="text-black underline underline-offset-2"
            >
              bingestudy.app@gmail.com
            </a>{" "}
            or contact us by post at:
          </p>
          <p className="not-italic">
            Aswin Sankar
            <br />
            Thekkinkoottathil House
            <br />
            Cherukattupulam PO
            <br />
            Vaniyamkulam, Kerala 679522
            <br />
            India
          </p>
        </PolicySection>

        <PolicySection
          id="request"
          title="12. How Can You Review, Update, Or Delete The Data We Collect From You?"
        >
          <p>
            Based on the applicable laws of your country, you may have the right
            to request access to the personal information we collect from you,
            details about how we have processed it, correct inaccuracies, delete
            your personal information, or withdraw your consent to our
            processing of it. These rights may be limited in some circumstances
            by applicable law. To request to review, update, or delete your
            personal information, please email{" "}
            <a
              href="mailto:bingestudy.app@gmail.com"
              className="text-black underline underline-offset-2"
            >
              bingestudy.app@gmail.com
            </a>
            .
          </p>
        </PolicySection>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-10 py-6 bg-black">
        <Link href="/" className="text-sm font-black text-white">
          BingeStudy
        </Link>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <span className="text-xs text-gray-500">
          © 2026 BingeStudy. Built for students.
        </span>
      </footer>
    </main>
  );
}

function PolicySection({ id, title, children }) {
  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-xl font-black text-black mb-4">{title}</h2>
      {children}
    </div>
  );
}
