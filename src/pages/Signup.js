import Footer from "../components/Footer";
import Header from "../components/Header.js";
import SignupComponent from "../components/SignupComponent.js";

function Signup() {
  const roundedHeaderButton = true;
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <SignupComponent />
      <Footer />
    </>
  );
}
export default Signup;
