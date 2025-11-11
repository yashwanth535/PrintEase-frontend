import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader />

      {/* Page Content */}
      <div className="flex-grow py-24 px-8">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
              Terms & Conditions
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              By accessing or using PrintEase, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              2. Service Description
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              PrintEase connects customers with nearby print shops, enabling document uploads, order tracking, and secure payment processing. We act only as a platform and are not responsible for print shop operations or output quality beyond our guarantee policy.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>You are responsible for the accuracy and legality of documents you upload.</li>
              <li>You must not upload copyrighted, harmful, or illegal content.</li>
              <li>You agree to pay for services as per the order details.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              4. Payments & Refunds
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              PrintEase requires 50% advance payment to prevent fraud. Refunds may be issued only in cases of proven print quality issues or service failure.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              5. Document Handling & Deletion
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              All uploaded documents are processed securely and automatically deleted after the printing process is completed. PrintEase or vendors do not retain your documents beyond the required time.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              6. Limitation of Liability
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              PrintEase is not liable for delays, vendor service quality variations, or document content issues. Our liability is limited to the amount paid for the order in question.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              7. Contact Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              For any concerns or support, contact:
            </p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              support@printease.com
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
