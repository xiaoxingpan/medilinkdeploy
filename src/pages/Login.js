import Footer from "../components/Footer";
import Header from "../components/Header.js";
import LoginComponent from "../components/LoginComponent.js";

function Login() {
  const roundedHeaderButton = true;
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <LoginComponent />
      <Footer />
    </>
  );
}
export default Login;
