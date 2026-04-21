import { Link } from "react-router-dom";

export default function Header() {
  return (

    <header className="fluid-container">
       <div className="container">
            <Link to="/" style={{ textDecoration: "none" }}>
            <div className="heading d-flex flex-column flex-md-row align-items-center justify-content-center">
                <img src="images/leafLogo.jpeg" className="logo-img pe-5" alt="Aura-Lee Logo" />

                {/* Force a column stack for the name and subtitle */}
                <div className="nameblock d-flex flex-column align-items-center align-items-md-start">
                    <h1 className="olive m-0">AURA-LEE</h1>
                    <h4 className="turquois m-0">massage therapy</h4>
                </div>
            </div>
            </Link>
        </div>
        <div className="d-flex justify-content-around olivebk bar">
            <ul className="barLinkCntr list-unstyled d-flex gap-3 justify-content-center m-0">
                <li>Heal.</li>
                <li>Move.</li>
                <li>Restore.</li>
            </ul>
        </div>
    </header>
  );
}