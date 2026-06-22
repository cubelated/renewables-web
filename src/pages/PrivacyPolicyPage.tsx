import LegalLayout from "../components/LegalLayout";

export default function PrivacyPolicyPage() {
    return (
        <LegalLayout
            title="Privacy Policy"
            updatedAt="22 June 2026"
        >
            <p>
                Renewly respects your privacy and is committed to
                protecting your personal information.
            </p>

            <h2>Information We Collect</h2>

            <h3>Account Information</h3>

            <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Google account identifier</li>
            </ul>

            <h3>User Content</h3>

            <ul>
                <li>Item titles</li>
                <li>Notes</li>
                <li>Expiry dates</li>
                <li>Reminder schedules</li>
            </ul>

            <h3>Device Information</h3>

            <ul>
                <li>Firebase Cloud Messaging token</li>
                <li>Timezone</li>
            </ul>

            <h2>How We Use Information</h2>

            <ul>
                <li>Authentication</li>
                <li>Notification delivery</li>
                <li>Account management</li>
                <li>Subscription management</li>
            </ul>

            <h2>Third-Party Services</h2>

            <ul>
                <li>Supabase</li>
                <li>Google Sign-In</li>
                <li>Firebase Cloud Messaging</li>
                <li>RevenueCat</li>
            </ul>

            <h2>Account Deletion</h2>

            <p>
                Users may request deletion of their account and
                associated data by contacting:
            </p>

            <p>
                <strong>cubelated@gmail.com</strong>
            </p>

            <h2>Contact</h2>

            <p>
                For privacy-related questions, contact:
            </p>

            <p>
                <strong>cubelated@gmail.com</strong>
            </p>
        </LegalLayout>
    );
}