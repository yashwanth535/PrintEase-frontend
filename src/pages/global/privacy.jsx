import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader />

      {/* Page Content */}
      <div className="flex-grow py-24 px-8">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
              Privacy Policy
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            At PrintEase, we take your privacy and security very seriously. This policy outlines how we collect, use, and protect the personal information you provide when using our services.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              1. Information We Collect
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We collect information that you voluntarily provide during sign-up, document upload, and order placement, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>Name and contact details</li>
              <li>Uploaded documents and print preferences</li>
              <li>Payment information (securely processed by our payment partners)</li>
              <li>Location data to display nearby print shops</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              2. How We Use Your Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>Process and fulfill your printing orders</li>
              <li>Improve the PrintEase experience</li>
              <li>Communicate updates, notifications, and support messages</li>
              <li>Ensure platform safety and compliance</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              3. Document Security & Retention
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              All uploaded documents are encrypted during transit and storage. Documents are automatically deleted from our servers and vendor systems after order completion, ensuring confidentiality.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              4. Third-Party Services
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We partner with secure third-party services for payments, notifications, and analytics. These services do not receive access to your documents, only necessary metadata for processing requests.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              5. Your Control
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              You may request deletion of your account or data at any time. For assistance, contact us at:
              <span className="block font-semibold text-slate-900 dark:text-slate-100 mt-1">
                support@printease.com
              </span>
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
