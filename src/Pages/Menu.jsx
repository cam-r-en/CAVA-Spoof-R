import { Link } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <>
      <div className="menuPage">
        <div className="mtopnav">
          <h4 className="mt-title">CAVA</h4>
          <div className="minfo">
            <nav className="mnavbar" id="mnavbar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contacts">Contacts</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="m-head">
          <img src="imgs/C.Menu.jpg" alt="CAVA MENU>" />
          <div className="m-text">
            <h1>MENU</h1>
          </div>
          <div className="m-obtn">
            <Link to="/order" className="modrbtn">
              {" "}
              ORDER
            </Link>
          </div>
        </div>
        <div className="menu">
          {/* Bowls */}
          <div className="s-menu">
            <div className="s-intro">
              <img src="imgs/Bowls.jpg" alt="BOWLS" />
              <h2>Bowls</h2>
            </div>
            <p>
              Some of our signature bowls include: <br />
              Spicy Lamb + Avocado, Chicken + Rice, Greek Salad, etc. <br />
            </p>
            <h6>
              Prices range from: <br />
              $12.95-$18.55 <br />
              (plus tax) <br />
              [All bowls are customizable]
            </h6>
          </div>
          <hr className="myhr" />
          {/* Pitas */}
          <div className="s-menu">
            <div className="s-intro">
              <img src="imgs/Pitas.jpg" alt="PITAS" />
              <h2>Pitas</h2>
            </div>
            <p>
              Some of our signature pitas include: <br />
              Greek Chicken, Steak + Feta, Spicy Chicken + Avocado, etc. <br />
              *We also include a Kids Peta meal.*
            </p>
            <h6>
              Prices range from: <br />
              $12.95-$17.85 <br />
              (plus tax) <br />
              [All pitas are customizable]
            </h6>
          </div>
          <hr className="myhr" />
          {/* Drinks */}
          <div className="s-menu">
            <div className="s-intro">
              <img src="imgs/Drinks.jpg" alt="DRINKS" />
              <h2>Drinks</h2>
            </div>
            <p>
              We offer various drinks like: <br />
              Blueberry Lavender, Cucumber Mint Lime, <br />
              Pineapple Mint Apple. <br />
              We also offer Lemonade, various teas, sodas, and <br />
              other canned/carton drinks.
            </p>
            <h6>
              $3.85 for large drinks <br />
              $3.45 for small drinks <br />
              $3.25 for canned drinks <br />
              $3.15 for kids drinks
            </h6>
          </div>
          <hr className="myhr" />
          <div className="closer">
            <div className="offers">
              <img src="imgs/Sides.jpg" alt="SIDES" />
              <p>
                We offer various side sauces, <br />
                as well as our Pita Chips.
              </p>
              <h6>
                $2.95 for Pita chips <br />
                Prices for side sauces range from: <br />
                $3.55-$4.35
              </h6>
            </div>
            <div className="offers">
              <img src="imgs/Desserts.jpg" alt="DESSERTS" />
              <p>
                We offer three delicious dessert options: <br />
                Salted Chocolate Oat Cookie, <br />
                Greystone Blondie & <br />
                Greystone Brownie.
              </p>
              <h6>
                $3.55 for Oat Cookie <br />
                $2.95 for Greystone pastries
              </h6>
            </div>
          </div>
          <hr className="myhr" />
          <h3 className="ending">
            Despite our efforts to support all dietary sensitivities, <br />
            we can't guarantee that our ingredients are 100% free of allergens
            or animal products. <br />
            This is due to our reliance on supplier information, <br />
            potential for cross-contamination with other foods in shared
            preparation and cooking areas, <br />
            and potential ingredient substitutions, <br />
            which may occur due to supply chain matters and variations in
            supplier practices.
          </h3>
        </div>
        <div className="mfooter">
          <h2 className="f-header">CONNECT WITH US!</h2>
          <div className="mcontacts">
            <div className="msocials">
              <img src="imgs/Insta.png" alt="INSTAGRAM" />
              <a
                hreclassName="myhr"
                f="https://instagram.com/cava"
                target="_blank"
              >
                Instagram
              </a>
            </div>
            <div className="msocials">
              <img src="imgs/Twit.png" alt="INSTAGRAM" />
              <a
                hreclassName="myhr"
                f="https://twitter.com/cava"
                target="_blank"
              >
                Twitter
              </a>
            </div>
            <div className="msocials">
              <img src="imgs/FB.png" alt="INSTAGRAM" />
              <a
                hreclassName="myhr"
                f="https://facebook.com/cava"
                target="_blank"
              >
                Facebook
              </a>
            </div>
            <div className="msocials">
              <img src="imgs/Indeed.png" alt="INSTAGRAM" />
              <a
                hreclassName="myhr"
                f="https://www.linkedin.com/company/cava-/"
                target="_blank"
              >
                Indeed
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
