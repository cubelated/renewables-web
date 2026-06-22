import LegalLayout from "../components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updatedAt="22 June 2026"
    >
      <p>
        By using Renewly, you agree to these Terms of Service.
      </p>

      <h2>Use of Service</h2>

      <p>
        Renewly helps users track renewals, reminders,
        subscriptions, and important dates.
      </p>

      <h2>User Responsibilities</h2>

      <ul>
        <li>Provide accurate information</li>
        <li>Use the service lawfully</li>
        <li>Protect account access</li>
      </ul>

      <h2>Subscriptions</h2>

      <p>
        Premium features are managed through Google Play
        Billing and RevenueCat.
      </p>

      <h2>Limitation of Liability</h2>

      <p>
        Renewly is provided on an "as-is" basis.
      </p>

      <p>
        We are not responsible for:
      </p>

      <ul>
        <li>Missed deadlines</li>
        <li>Missed reminders</li>
        <li>Service interruptions</li>
        <li>Data loss beyond reasonable control</li>
      </ul>

      <h2>Changes to Terms</h2>

      <p>
        We may update these Terms periodically.
      </p>

      <h2>Contact</h2>

      <p>
        Questions may be directed to:
      </p>

      <p>
        <strong>cubelated@gmail.com</strong>
      </p>
    </LegalLayout>
  );
}