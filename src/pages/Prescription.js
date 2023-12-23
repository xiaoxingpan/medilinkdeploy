import Footer from "../components/Footer";
import Header from "../components/Header.js";
import PrescriptionList from "../components/PrescriptionList.js";

function Prescription() {
  const roundedHeaderButton = true;
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <PrescriptionList />
      <Footer />
    </>
  );
}
export default Prescription;
