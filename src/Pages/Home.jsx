import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <>
      <div className="homePage">
        <div className="info">
          <nav className="navbar" id="navbar">
            <ul>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contacts">Contacts</Link>
              </li>
            </ul>
          </nav>
          <Link to="/order" className="h-odrbtn">
            ORDER
          </Link>
        </div>
        <div className="title">
          <img src="imgs/CAVA [L].jpg" alt="CAVA LOGO" />
        </div>
        <div className="footer">
          <div className="contacts">
            <div className="socials">
              <img src="imgs/Insta.png" alt="INSTAGRAM" />
              <a href="https://instagram.com/cava" target="_blank">
                Instagram
              </a>
            </div>
            <div className="socials">
              <img src="imgs/Twit.png" alt="INSTAGRAM" />
              <a href="https://twitter.com/cava" target="_blank">
                Twitter
              </a>
            </div>
            <div className="socials">
              <img src="imgs/FB.png" alt="INSTAGRAM" />
              <a href="https://facebook.com/cava" target="_blank">
                Facebook
              </a>
            </div>
            <div className="socials">
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

export default Home;
