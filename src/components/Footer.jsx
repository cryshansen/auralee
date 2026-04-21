export default function Footer() {
  return (
   <footer className="container-fluid olivebk_footer p-0 mt-5">
  <div className="container ">
    <div className="row align-items-center justify-content-between">
      
      {/* Left Column */}
      <div className="col-md-3">
        <h6>Aura-Lee Massage Therapy</h6>
        <ul style={{ listStyle: 'none', paddingLeft: 0, paddingRight: 0 }}>
          <li>Prairie Sky Integrative Health, <br /> 2146 Robinson St, <br />Regina, Sk S4T 2P7</li>
          <li><i className="fas fa-phone-alt"></i> 306 745-9085</li>
          <li><i className="fas fa-envelope"></i> aura-lee@auralee.ca</li>
        </ul>
      </div>

      {/* Center Logo */}
      <div className="col-md-3 text-center">
        <img src="images/leafLogo_footer.png" alt="Leaf Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>

      {/* Right Column */}
      <div className="col-md-3 text-left m-0 p-0">
        <ul className="social list-inline text-right">
          <li className="list-inline-item"><i className="fab fa-facebook-f"></i></li>
          <li className="list-inline-item">
            <a href="https://www.instagram.com/zacklyrite/" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="https://ca.linkedin.com/in/aura-zack-3228b6a3" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>
          <li><i className="fas fa-phone-alt"></i></li>
           <li><i className="fas fa-envelope"></i></li>
        </ul>
        <ul className="list-unstyled ">
          <li>&copy; 1997 Aura-Lee Massage Therapy. All Rights Reserved.</li>
        </ul>
      </div>
    </div>
  </div>
</footer>
  );
}
