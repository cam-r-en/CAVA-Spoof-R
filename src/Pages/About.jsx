import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <>
      <div className="aboutPage">
        <div className="atopnav">
          <h4 className="at-title">CAVA</h4>
          <div className="ainfo">
            <nav className="anavbar" id="anavbar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/menu">Menu</Link>
                </li>
                <li>
                  <Link to="/contacts">Contacts</Link>
                </li>
              </ul>
            </nav>
          </div>
          <Link to="/order" className="odrbtn">
            ORDER
          </Link>
        </div>
        <div className="a-head">
          <img src="imgs/C.Bowl.png" alt="CAVA BOWL" />
          <div className="ab-text">
            <h1>ABOUT US...</h1>
          </div>
        </div>
        <div className="a-info">
          <div className="a-hinfo">
            <h2>WE BELIEVE IN:</h2>
            <img src="imgs/C.Platter.jpg" alt="CAVA PLATTER" />
          </div>
          <p>
            Serving delicious food that helps <br />
            more people eat well and live well.
            <br />
            Taking care of the people and things that feed us: <br />
            the earth, farmers, purveyors, and team members.
            <br />
            Food as a unifier, for a more diverse yet inclusive <br />
            world, where all are welcome.
            <br />
            <br />
            IN ALL OF OUR RELATIONSHIPS, <br />
            WE PRIORITIZE LASTING VALUE FOR OUR GUESTS, <br />
            THE EARTH, AND OUR PARTNERS.
          </p>
        </div>
        <hr className="myhr" />
        <div className="a-story">
          <div className="a-tstory">
            <h3>
              "WE MAKE FOOD THAT TASTES <br />
              GOOD <br />
              AND MAKES YOU FEEL <br />
              GOOD."
            </h3>
            <p>
              We are inspired by our Mediterranean roots, where deliciousness
              and health are inseparable. <br />
              Sacrificing health for flavor? <br />
              Or flavor for health? <br />
              Not at CAVA — no compromises here. <br />
              After all, Mediterranean families have been perfecting this way of
              eating for a mere 4,000 years.
            </p>
          </div>
          <img src="imgs/C.Bag.jpg" alt="CAVA BAG" />
        </div>
        <h3 className="t-gallery"> Take A GANDER... </h3>
        <div className="gallery">
          <img src="imgs/C.Int.webp" alt="CAVA INT" />
          <img src="imgs/C.F.jpg" alt="CAVA F" />
          <img src="imgs/C.Int 2.jpg" alt="CAVA INT2" />
          <img src="imgs/C.F 2.jpg" alt="CAVA F2" />
          <img src="imgs/C.Int 3.webp" alt="CAVA INT3" />
          <img src="imgs/C.F 3.jpg" alt="CAVA F3" />
        </div>

        <div className="afooter">
          <h2 className="f-header">CONNECT WITH US!</h2>
          <div className="acontacts">
            <div className="asocials">
              <img src="imgs/Insta.png" alt="INSTAGRAM" />
              <a href="https://instagram.com/cava" target="_blank">
                Instagram
              </a>
            </div>
            <div className="asocials">
              <img src="imgs/Twit.png" alt="INSTAGRAM" />
              <a href="https://twitter.com/cava" target="_blank">
                Twitter
              </a>
            </div>
            <div className="asocials">
              <img src="imgs/FB.png" alt="INSTAGRAM" />
              <a href="https://facebook.com/cava" target="_blank">
                Facebook
              </a>
            </div>
            <div className="asocials">
              <img src="imgs/Indeed.png" alt="INSTAGRAM" />
              <a href="https://www.linkedin.com/company/cava-/" target="_blank">
                Indeed
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
