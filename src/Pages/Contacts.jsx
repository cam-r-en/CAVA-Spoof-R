import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Contacts.css";

function Contacts() {
  useEffect(() => {
    // hide the global body border while this page is mounted
    const previous = document.body.style.border;
    document.body.style.border = "none";
    return () => {
      // restore previous border when leaving the page
      document.body.style.border = previous || "";
    };
  }, []);
  return (
    <>
      <div className="contactsPage">
        <div className="ctopnav">
          <h4 className="ct-title">CAVA</h4>
          <div className="cinfo">
            <nav className="cnavbar" id="cnavbar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/menu">Menu</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="c-head">
          <img src="imgs/C.Team.jpg" alt="TEAM" />
        </div>
        <div className="c-text">
          <h1>
            CONTACT <br />
            US
          </h1>
        </div>
        <div className="location">
          <div className="l-title">
            <h1>LOCATED:</h1>
            <p>(in New York)</p>
          </div>
          <div className="l-content">
            <p>
              <a
                href="https://cava.com/locations/union-square-ny"
                target="_blank"
              >
                Union Square
              </a>
            </p>
            <img src="imgs/C.Loc.png" alt="LOCATION" />
          </div>
        </div>
        <h6 className="hello">Send us a Message...</h6>
        <hr />
        <div className="r-out">
          <form>
            <label for="fname">Name:</label>
            <br />
            <input type="text" id="name" name="name" />
            <br />
            <label for="lname">Email:</label>
            <br />
            <input type="text" id="email" name="email" />
            <br />
            <label for="lname">Message:</label>
            <br />
            <input type="text" id="message" name="message" /> <br />
            <input type="submit" id="submit" name="submit" />
          </form>
        </div>
        <div className="cfooter">
          <h2 className="cf-header">CONNECT WITH US!</h2>
          <div className="ccontacts">
            <div className="csocials">
              <img src="imgs/Insta.png" alt="INSTAGRAM" />
              <a href="https://instagram.com/cava" target="_blank">
                Instagram
              </a>
            </div>
            <div className="csocials">
              <img src="imgs/Twit.png" alt="INSTAGRAM" />
              <a href="https://twitter.com/cava" target="_blank">
                Twitter
              </a>
            </div>
            <div className="csocials">
              <img src="imgs/FB.png" alt="INSTAGRAM" />
              <a href="https://facebook.com/cava" target="_blank">
                Facebook
              </a>
            </div>
            <div className="csocials">
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

export default Contacts;
