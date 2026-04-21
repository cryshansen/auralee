export default function CancelationPolicy() {
  return (
    <>

        <section className="mt-5">
            <div className="row justify-content-around" style={{ display:'flex', flexDirection:'row', justifyContent:'center', fontSize:'35px' }}>
                <div className="col-md-6 text-center">
                    <h4 className="turquois "><i className="fas fa-phone-alt"></i> 306 745-9085 call or text.</h4>
                </div>
                
                <div className="col-md-6 text-center">
                    <h4 className="turquois "><i className="fas fa-envelope"></i> aura.zack@gmail.com</h4>
                </div>
            </div>
        </section>

      <section className="">
        <div className="row">
            <h4 className="turquois">Cancelation Policy:</h4>
            <p>Please understand that I require 24 hrs notice of cancellations. If I do not receive this notice, you may be
            required to pay a fee to cover the missed appointment. When you schedule an appointment with me,
            that appointment is set aside for you and ONLY you. Massage therapists only get paid when the therapy
            is delivered and therefore, when there is a missed appointment, it is costly for us and prevent us from
            assisting other clients with their needs.
            ( I recognize that there circumstances that are out of your control, such as illness, family emergencies
            etc. and therefore, I may make an exception to the policy on those rare occasions)</p>
        </div>
    </section>
     {/* <section className="">
        <div className="row">
        <h4 className="turquois">COVID -19 Considerations:</h4>
        <p>Following the Saskatchewan Health Authority directives, I have the protocols in place, including PPE and
        increased disinfecting regime. Due to the increased protocols, I have slightly reduced appointment times
        to accommodate the time needed to carry out the extra cleaning between clients.
        I ask that you do not come too early, so as to avoid any extra time in the waiting area.
        There will be a waiver to be signed and an extra screening form to be filled out and signed for each visit.
        If you are ill, PLEASE STAY HOME.</p>
        <p>Thank you for your support and understanding during these unprecedented times.
        </p>
        </div>
     </section> */}
    </>
  );
}
