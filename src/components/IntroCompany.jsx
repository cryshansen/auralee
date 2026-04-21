import React, { useState } from 'react';
import RelocateComponent from './RelocateComponent';

export default function IntroCompany() {
  return (
    <>
    <main>
      <RelocateComponent />
      <section className="">
        <div className="row main">
          <h4 className="turquois">Aura-Lee Zack, Registered Massage Therapist</h4>
              <p>Taking care of your wellbeing is very essential in this busy, stressful world. Massage therapy can be part
                  of your self-care, as it is helpful in decreasing stress and anxiety, relieving pain, offset improper
                  ergonomics and poor posture, improve range of motion and mobility to make everyday activities easier,
                  while aiding in rehabilitation of physical injuries.</p>
              <p>I have been committed to excellence since establishing my clinic in 1997 within a professional, tranquil
                  and safe environment. The target of my treatments is of a therapeutic nature, although I also offer a
                  spectrum of soft tissue specialized techniques such as Hot Stone massage, myofascial work and cupping
                  massage to assist you in reaching your health goals. I look forward to helping with your wellness plan, so
                  you can get closer to your best again.</p>
          </div>
      </section>
      <section className="c">
        <div className="row main">
          <h4>The Treatment</h4>
          <p>Sometimes life throws punches your way (that actually do hurt). Poor posture, insufficient exercise, overwork or injury are some of the circumstances that lead to discomfort, pain, restriction in mobility
      and more. Hands on techniques are used to manipulate soft tissues ( muscles, connective tissue, fascia, etc) to provide therapeutic relief of the conditions, which can also compliment other modalities to
      speed up the recovery process and obtain the best possible outcome. As part of the treatment, I may include instruction of self-administered pain management techniques such as stretching, strengthening
      exercises, use of heat or cold, as strategies to try to keep bodies maintained and running as smoothly as possible.</p>
        </div>
      </section>
      <section className="">
          <div className="row main">
            <h4 className="turquois">Company Background</h4> 
            <p>Owner and operator/Registered Massage Therapist, Aura-Lee Zack created and registered the company in 1997. The clinic is designed and managed by Aura. She aims to create a professional, clinical, yet relaxing space. Her target market includes any individual that reside in Esterhazy, Saskatchewan and surrounding area, specifically those with physical ailments and those interested in integrative medicine.</p>
        </div>
      </section>
      <section className="">
        <div className="row main">
          <h4>Mission Statement</h4>
          <p>Dedication is given to provide an effective treatment in a safe and caring environment, as I strive to restore, maintain and encourage optimal health and to provide an opportunity to be part of the client"s wellness plan for their best quality of life.</p>
        </div>
      </section>
    </main>
    </>
  );
}
