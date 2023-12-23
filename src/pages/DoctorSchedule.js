import Footer from "../components/Footer";
import Header from "../components/Header.js";
import DoctorScheduleList from "../components/DoctorScheduleList.js";

function DoctorSchedule() {
  const roundedHeaderButton = true;
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <DoctorScheduleList />
      <Footer />
    </>
  );
}
export default DoctorSchedule;