import Footer from "./component/footer";
import Header from "./component/header";

const Policy = () => {
  return (
    <>
        <Header activeHeader="" />
        <div className="container sm:w-[60vw] mx-auto my-32">
            <h1 className="text-center text-4xl font-bold my-8">Privacy Policy</h1>
            <p className="text-muted-foreground">
                We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our online booking platform.
            </p>

            <h2 className="font-semibold text-xl my-2">1. Information Collection</h2>
            <p className="text-muted-foreground">
                We collect personal information such as your name, contact details, and booking preferences when you register or make a booking. Non-personal data, like browser type and access times, may also be collected automatically.
            </p>

            <h2 className="font-semibold text-xl my-2">2. Use of Collected Information</h2>
            <p className="text-muted-foreground">
                Your information is used to process bookings, provide customer support, and improve our services. We may use your email to send promotional offers or updates. You can opt out at any time.
            </p>

            <h2 className="font-semibold text-xl my-2">3. Data Sharing</h2>
            <p className="text-muted-foreground">
                We do not sell your personal data to third parties. Data may be shared with washing centers to complete your bookings or with service providers who assist us in our operations. We may disclose your information if required by law.
            </p>

            <h2 className="font-semibold text-xl my-2">4. Security</h2>
            <p className="text-muted-foreground">
                We use encryption and other security measures to protect your data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-semibold text-xl my-2">5. Cookies</h2>
            <p className="text-muted-foreground">
                Our platform uses cookies to enhance user experience. You can disable cookies in your browser settings.
            </p>

            <h2 className="font-semibold text-xl my-2">6. User Rights</h2>
            <p className="text-muted-foreground">
                You have the right to access, correct, or delete your personal information. Contact us for any data-related requests.
            </p>

            <h2 className="font-semibold text-xl my-2">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
                We may update this policy from time to time. The latest version will always be available on our platform.
            </p>
        </div>
        <Footer />
    </>
  );
};

export default Policy;
