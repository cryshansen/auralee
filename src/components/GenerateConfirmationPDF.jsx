import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Optional


import registerPlaifairFont from "../fonts/PlayfairDisplay-Regular-normal.js";
import registerMontserratFont from "../fonts/Montserrat-Regular-normal.js";

registerMontserratFont(jsPDF.API); // ✅ Run once globally
registerPlaifairFont(jsPDF.API); // ✅ Run once globally

const generateBookingPDF = ({ firstname,  lastname,  email,  phone,  date,  time,  confirmationNumber, }) =>{

  const doc = new jsPDF();
  
  
  // Add logo (ensure it's a base64 string or hosted image on same origin)
  const logoUrl = "/images/leafLogo_footer.png"; // Relative to public/

  // 1. Add logo
  const img = new Image();
  img.src = logoUrl;

  img.onload = () => {
    doc.addImage(img, "PNG", 25, 10, 23.25, 27.25); // x, y, width, height (95, 107) 23.25 27.25

    // 2. Add header
    doc.setFont("Montserrat-Regular");
    doc.setFontSize(18);
    doc.text("Zackly-Rite Massage Therapy", 60, 20);
    doc.setFont("PlayfairDisplay-Regular");
    doc.setFontSize(12);
    doc.text("812 Park Ave, Esterhazy, Sk S0A 0X0", 60, 27);
    doc.text("zacklyrite@sasktel.net | 306-745-9085", 60, 33);

    // 3. Add title
    doc.setFont("Montserrat-Regular");
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Appointment Confirmation", 15, 55);

    // 4. Appointment details
    autoTable(doc, {
      startY: 60,
      head: [["Name", "Date", "Time"]],
      body: [[firstname + " " + lastname, date, time]],
      theme: "striped",
      headStyles: {
        fillColor: ['#a2ab4e'], // RGB for green
      },
    });

    // 5. Thank-you message
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Thank you for booking with us. We look forward to seeing you!", 15, doc.lastAutoTable.finalY + 20);

    // 6. Save or open
    doc.save("Zackly-Rite-Confirmation.pdf");
  };
}
export default generateBookingPDF;