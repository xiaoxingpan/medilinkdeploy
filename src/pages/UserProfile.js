import Footer from "../components/Footer";
import Header from "../components/Header.js";
import DoctorProfileComponent from "../components/DoctorProfileComponent.js"
import PatientProfile from "../components/PatientProfileComponent.js";

function UserProfile() {
    const roundedHeaderButton = true;
    return (
      <>
        <Header roundedHeaderButton={roundedHeaderButton} />
            {/* <DoctorProfileComponent/> */}
            <PatientProfile/>
        <Footer />
      </>
    );
  }
  export default UserProfile;