import Footer from "./component/footer";
import Header from "./component/header";

const TermsAndConditions = () => {
  return (
    <>
        <Header activeHeader="" />
        <div className="container sm:w-[60vw] mx-auto my-32">
            <h1 className="text-center text-4xl font-bold my-8">Terms and Conditions</h1>
            <p className="text-muted-foreground">
                These Terms and Conditions govern the use of our online booking platform for washing centers.
            </p>

            <h2 className="font-semibold text-xl my-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
                By using our platform, you agree to these Terms and Conditions. If you do not agree, please do not use our service.
            </p>

            <h2 className="font-semibold text-xl my-2">2. Platform Use</h2>
            <p className="text-muted-foreground">
                Our platform allows users to create bookings with washing centers listed on our portal. Users must provide accurate and up-to-date information when making a booking. We reserve the right to refuse service, terminate accounts, or cancel bookings at our discretion.
            </p>

            <h2 className="font-semibold text-xl my-2">3. Booking Process</h2>
            <p className="text-muted-foreground">
                Bookings are subject to availability and the policies of the respective washing centers. Confirmation of a booking does not guarantee the availability of services.
            </p>

            <h2 className="font-semibold text-xl my-2">4. Cancellation and Refund Policy</h2>
            <p className="text-muted-foreground">
                Cancellation policies may vary between washing centers. Users should review the cancellation terms for each booking. Refunds, if applicable, will be processed according to the policies of the respective washing center.
            </p>

            <h2 className="font-semibold text-xl my-2">5. User Responsibilities</h2>
            <p className="text-muted-foreground">
                Users are responsible for their account activity and must keep login credentials secure. Misuse of the platform, such as fraudulent bookings or providing false information, is prohibited.
            </p>

            <h2 className="font-semibold text-xl my-2">6. Liability Limitation</h2>
            <p className="text-muted-foreground">
                We are not liable for any issues related to the services provided by the washing centers. Our platform is provided "as-is" without warranties of any kind.
            </p>

            <h2 className="font-semibold text-xl my-2">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
                We may update these Terms and Conditions periodically. The latest version will be posted on our platform.
            </p>

            <h2 className="font-semibold text-xl my-2">8. Governing Law</h2>
            <p className="text-muted-foreground">
                These Terms and Conditions shall be governed by the laws of [Your Jurisdiction].
            </p>
        </div>
        <Footer />
    </>
  );
};

export default TermsAndConditions;
