import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ordersAPI, menuAPI, cartAPI } from "../api/api.js";
import { getSessionId } from "../utils/session.js";
import "./Order.css";

function Order() {
  // --- Cart state ---
  const [cart, setCart] = useState([]);
  const nextId = useRef(1);
  const sessionId = useRef(getSessionId()); // Persistent session ID

  // --- Drawer visibility ---
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- Menu data from API ---
  const [signatureBowls, setSignatureBowls] = useState([]);
  const [signaturePitas, setSignaturePitas] = useState([]);
  const [customBowlOptions, setCustomBowlOptions] = useState(null);
  const [customPitaOptions, setCustomPitaOptions] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Form refs ---
  const sigBowlRef = useRef(null);
  const customBowlRef = useRef(null);
  const sigPitaRef = useRef(null);
  const customPitaRef = useRef(null);
  const drinksRef = useRef(null);

  // --- Load cart from database on mount ---
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await cartAPI.get(sessionId.current);
        if (savedCart.items && savedCart.items.length > 0) {
          setCart(savedCart.items);
          // Update nextId to avoid conflicts
          const maxId = Math.max(...savedCart.items.map(item => item.id), 0);
          nextId.current = maxId + 1;
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        // Continue with empty cart if load fails
      }
    };
    
    loadCart();
  }, []);

  // --- Fetch menu items from API ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [bowls, pitas, customBowl, customPita, drinkItems] = await Promise.all([
          menuAPI.getByCategory('signature-bowl'),
          menuAPI.getByCategory('signature-pita'),
          menuAPI.getByCategory('custom-bowl'),
          menuAPI.getByCategory('custom-pita'),
          menuAPI.getByCategory('drink'),
        ]);
        
        setSignatureBowls(bowls);
        setSignaturePitas(pitas);
        setCustomBowlOptions(customBowl[0]); // Get first (only) custom bowl template
        setCustomPitaOptions(customPita[0]); // Get first (only) custom pita template
        setDrinks(drinkItems);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load menu:', error);
        alert('Failed to load menu items. Make sure the backend server is running.');
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);

  // --- Save cart to database whenever it changes ---
  useEffect(() => {
    const saveCart = async () => {
      try {
        await cartAPI.save(sessionId.current, cart);
      } catch (error) {
        console.error('Failed to save cart:', error);
        // Don't show alert to avoid disrupting user experience
      }
    };
    
    // Only save if cart has been loaded (avoid saving empty cart on mount)
    if (cart.length > 0 || nextId.current > 1) {
      saveCart();
    }
  }, [cart]);

  // --- hide global body border while mounted (your original behavior) ---
  useEffect(() => {
    const previous = document.body.style.border;
    document.body.style.border = "none";
    return () => {
      document.body.style.border = previous || "";
    };
  }, []);

  // --- Helpers to read checked values from a formRef ---
  const getCheckedValues = (formEl, name) => {
    if (!formEl) return [];
    const inputs = Array.from(formEl.querySelectorAll(`input[name="${name}"]:checked`));
    return inputs.map((input) => input.value);
  };

  // --- Validate required fields for custom forms (base, protein, dressing) ---
  const validateCustom = (formEl) => {
    const requiredFields = ["base", "protein", "dressing"];
    for (const name of requiredFields) {
      const values = getCheckedValues(formEl, name);
      if (values.length === 0) {
        alert(`Please select at least one ${name}.`);
        return false;
      }
    }
    return true;
  };

  // --- Adders ---
  const addSignatureItem = (formEl) => {
    if (!formEl) return;
    const fieldsets = Array.from(formEl.querySelectorAll("fieldset"));
    const entries = fieldsets
      .map((fs) => {
        const name = fs.querySelector("legend")?.textContent?.trim() || "Signature Item";
        const toppings = Array.from(fs.querySelectorAll("input[type='checkbox']:checked")).map((cb) => cb.value);
        return {
          id: nextId.current++,
          name,
          toppings,
          removedToppings: [],
          quantity: 1,
          type: "signature",
        };
      })
      .filter((entry) => entry.toppings.length > 0);
    
    if (entries.length === 0) {
      alert("Please select at least one topping for each item you want to add.");
      return;
    }
    
    setCart((c) => [...c, ...entries]);
  };

  const addCustomItem = (formEl, formIdLabel = "Custom Item") => {
    if (!formEl) return;
    if (!validateCustom(formEl)) return;
    const base = getCheckedValues(formEl, "base");
    const protein = getCheckedValues(formEl, "protein");
    const spreads = getCheckedValues(formEl, "spread");
    const toppings = getCheckedValues(formEl, "topping");
    const dressings = getCheckedValues(formEl, "dressing");

    const type = formIdLabel.includes("Bowl") ? "Custom Bowl" : "Custom Pita";
    const entry = {
      id: nextId.current++,
      name: type,
      base,
      protein,
      spreads,
      toppings,
      dressings,
      quantity: 1,
      type: "custom",
    };
    setCart((c) => [...c, entry]);
  };

  const addDrinks = (formEl) => {
    if (!formEl) return;
    const fieldsets = Array.from(formEl.querySelectorAll("fieldset"));
    const entries = [];
    fieldsets.forEach((fs) => {
      const drinkName = fs.querySelector("legend")?.textContent?.trim() || "Drink";
      // reading checkboxes that represent sizes; in your markup each size used same name sometimes
      // we'll gather checked inputs inside this fieldset
      const checked = Array.from(fs.querySelectorAll("input[type='checkbox']:checked")).map((cb) => cb.value);
      checked.forEach((size) => {
        entries.push({
          id: nextId.current++,
          name: drinkName,
          size,
          quantity: 1,
          type: "drink",
        });
      });
    });
    setCart((c) => [...c, ...entries]);
  };

  // --- Remove item ---
  const removeItem = (id) => {
    setCart((c) => c.filter((e) => e.id !== id));
  };

  // --- Update a single item by id (partial merge) ---
  const updateItem = (id, patch) => {
    setCart((c) => c.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  // --- Clear cart helper (optional) ---
  const clearCart = () => setCart([]);

  // --- Submit order to MongoDB ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Add items before submitting your order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cart,
        totalItems: cart.length,
        // Optional: add customer info here
        // customerName: 'John Doe',
        // customerEmail: 'john@example.com',
        // customerPhone: '555-1234',
      };

      console.log('Submitting order:', orderData);
      console.log('Cart items:', JSON.stringify(cart, null, 2));

      const result = await ordersAPI.create(orderData);
      alert(`Order submitted successfully! Order ID: ${result.order._id}`);
      
      // Clear cart after successful submission (both state and database)
      await cartAPI.clear(sessionId.current);
      clearCart();
      setDrawerOpen(false);
    } catch (error) {
      console.error('Order submission error:', error);
      alert(`Failed to submit order: ${error.message}\n\nMake sure the backend server is running (npm run dev in the server folder)`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI components for cart items with editing ---
  function CartItem({ entry }) {
    const [editing, setEditing] = useState(false);
    // local copy for editing purposes
    const [local, setLocal] = useState(entry);

    // Sync local when entry changes (e.g., external updates)
    useEffect(() => {
      setLocal(entry);
    }, [entry]);

    const cancel = () => {
      setLocal(entry);
      setEditing(false);
    };

    const save = () => {
      // small validation could be added here
      updateItem(entry.id, local);
      setEditing(false);
    };

    // RENDERS
    if (!editing) {
      return (
        <div className="cart-entry">
          <strong>
            {entry.name} {entry.size ? `(${entry.size})` : ""}
          </strong>
          {entry.removedToppings && entry.removedToppings.length > 0 && (
            <div className="removed-list" style={{ fontSize: "0.9em", color: "#666", marginTop: 6 }}>
              Removed: {entry.removedToppings.join(", ")}
            </div>
          )}
          <div className="cart-entry-actions">
            <button type="button" onClick={() => setEditing(true)} className="edit-btn">
              Edit
            </button>
            <button type="button" onClick={() => removeItem(entry.id)} className="remove-btn">
              Remove
            </button>
          </div>
        </div>
      );
    }

    // Editing UI per type
    if (entry.type === "drink") {
      return (
        <div className="cart-entry edit-form">
          <strong>
            {entry.name} (x{entry.quantity})
          </strong>
          <div>
            <label>
              <input
                type="radio"
                name={`size-${entry.id}`}
                value="small"
                checked={local.size === "small"}
                onChange={() => setLocal((l) => ({ ...l, size: "small" }))}
              />
              Small
            </label>
            <br />
            <label>
              <input
                type="radio"
                name={`size-${entry.id}`}
                value="large"
                checked={local.size === "large"}
                onChange={() => setLocal((l) => ({ ...l, size: "large" }))}
              />
              Large
            </label>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={save} className="save-btn">
              Save
            </button>
            <button type="button" onClick={cancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (entry.type === "custom") {
      // categories with canonical options (kept similar to your original)
      const categories = {
        base: ["Brown Rice", "SuperGreens", "Lentils", "RightRice", "Pita"],
        protein: ["Grilled Chicken", "Falafel", "Braised Lamb", "Roasted Veggies"],
        spreads: ["Hummus", "Crazy Feta", "Roasted Red Pepper Hummus", "Tzatziki"],
        toppings: ["Pickled Onions", "Cabbage Slaw", "Avocado", "Kalamata Olives", "Tomato + Cucumber"],
        dressings: ["Greek Vinaigrette", "Lemon Herb Tahini", "Harissa", "Yogurt Dill"],
      };

      const toggle = (cat, option) => {
        const current = local[cat] || [];
        if (current.includes(option)) {
          setLocal((l) => ({ ...l, [cat]: current.filter((v) => v !== option) }));
        } else {
          setLocal((l) => ({ ...l, [cat]: [...current, option] }));
        }
      };

      return (
        <div className="cart-entry edit-form">
          <strong>
            {entry.name} (x{entry.quantity})
          </strong>
          <div>
            {Object.entries(categories).map(([cat, opts]) => (
              <div key={cat}>
                <h4>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                {opts.map((opt) => (
                  <label key={opt} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={(local[cat] || []).includes(opt)}
                      onChange={() => toggle(cat, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => { save(); }} className="save-btn">
              Save
            </button>
            <button type="button" onClick={cancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // signature editing: checkboxes represent toppings; unchecked => removed
    if (entry.type === "signature") {
        // All possible toppings for any signature item
        const allToppingsList = ["Tomato + Onion", "Pickled Onions", "Avocado", "Greens", "Feta", "Kalamata Olives", "Briny Pickles"];
      const toggleTopping = (topping) => {
        const removed = local.removedToppings || [];
        const stillPresent = !removed.includes(topping);
        if (stillPresent) {
          // uncheck -> add to removed
          setLocal((l) => ({ ...l, removedToppings: [...removed, topping] }));
        } else {
          // check -> remove from removed
          setLocal((l) => ({ ...l, removedToppings: removed.filter((t) => t !== topping) }));
        }
      };

      return (
        <div className="cart-entry edit-form">
          <strong>
            {entry.name} (x{entry.quantity})
          </strong>
          <div>
            {allToppingsList.map((t) => {
              const checked = !(local.removedToppings || []).includes(t);
              return (
                <label key={t} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleTopping(t)}
                  />
                  {t}
                </label>
              );
            })}
          </div>
          <div className="removed-preview" style={{ marginTop: 8, fontSize: "0.9em", color: "#666" }}>
            Removed: {(local.removedToppings && local.removedToppings.length > 0) ? local.removedToppings.join(", ") : "none"}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                // save removedToppings
                save();
              }}
              className="save-btn"
            >
              Save
            </button>
            <button type="button" onClick={cancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // fallback
    return (
      <div className="cart-entry">
        <strong>{entry.name}</strong>
        <div>
          <button type="button" onClick={() => setEditing(false)} className="save-btn">Done</button>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <>
      <div className="orderPage">
        <div className="o-head">
          <div className="o-text">
            <h1 className="option-heading">ORDER HERE</h1>
            <div className="oinfo">
              <nav className="onavbar" id="onavbar">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
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
            </div>
          </div>
          <div className="cart-container">
            <button
              className="cart-icon-button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open cart"
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <img id="cart-icon" src="imgs/F.Bag.png" alt="CAVA MENU" />
            </button>
            <span id="cart-count">{cart.length}</span>
          </div>
        </div>

        {/* Cart Drawer */}
        <div
          id="cart-drawer"
          style={{
            right: drawerOpen ? 0 : "-400px",
            transition: "right 0.25s ease",
            position: "fixed",
            top: 0,
            height: "100%",
            width: 360,
            background: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 9999,
            padding: 16,
            overflowY: "auto",
          }}
        >
          <h2>Your Cart</h2>
          <div id="cart-items">
            {cart.length === 0 && <div>Your cart is empty</div>}
            {cart.map((entry) => (
              <CartItem key={entry.id} entry={entry} />
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexDirection: 'column' }}>
            <button 
              type="button" 
              onClick={submitOrder}
              disabled={isSubmitting || cart.length === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: cart.length === 0 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Submitting...' : `Submit Order (${cart.length} items)`}
            </button>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" id="close-cart" onClick={() => setDrawerOpen(false)} style={{ flex: 1 }}>
                Close
              </button>
              <button type="button" id="clear-cart" onClick={clearCart} style={{ flex: 1 }}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <h1 className="option-heading">Bowls & Pitas Menu</h1>

        {/* SIGNATURE BOWLS - Dynamic from API */}
        {loading ? (
          <div>Loading menu...</div>
        ) : (
          <form className="oform" id="sigBowlForm" ref={sigBowlRef}>
            <h2>Signature Bowls</h2>

            {signatureBowls.map((bowl) => (
              <fieldset key={bowl._id}>
                <legend>{bowl.name}</legend>
                {bowl.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{bowl.description}</p>}
                {bowl.defaultToppings && bowl.defaultToppings.map((topping) => (
                  <React.Fragment key={topping}>
                    <label>
                      <input 
                        type="checkbox" 
                        name={`sig-${bowl._id}-topping`}
                        value={topping} 
                        defaultChecked 
                      />
                      {topping}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            ))}

            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addSignatureItem(sigBowlRef.current);
              }}
            >
              Add Signature Bowl(s) to Cart
            </button>
          </form>
        )}

        <hr className="ohr" />

        {/* CUSTOM BOWLS - Dynamic from API */}
        {loading || !customBowlOptions ? (
          <div>Loading menu...</div>
        ) : (
          <form className="oform" id="customBowlForm" data-custom="true" ref={customBowlRef}>
            <h2>Customize Your Own Bowl</h2>

            {customBowlOptions.availableOptions?.bases && (
              <fieldset>
                <legend>Bases (required)</legend>
                {customBowlOptions.availableOptions.bases.map((base) => (
                  <React.Fragment key={base}>
                    <label>
                      <input type="checkbox" name="base" value={base} />
                      {base}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customBowlOptions.availableOptions?.proteins && (
              <fieldset>
                <legend>Proteins (required)</legend>
                {customBowlOptions.availableOptions.proteins.map((protein) => (
                  <React.Fragment key={protein}>
                    <label>
                      <input type="checkbox" name="protein" value={protein} />
                      {protein}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customBowlOptions.availableOptions?.spreads && (
              <fieldset>
                <legend>Spreads & Dips</legend>
                {customBowlOptions.availableOptions.spreads.map((spread) => (
                  <React.Fragment key={spread}>
                    <label>
                      <input type="checkbox" name="spread" value={spread} />
                      {spread}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customBowlOptions.availableOptions?.toppings && (
              <fieldset>
                <legend>Toppings</legend>
                {customBowlOptions.availableOptions.toppings.map((topping) => (
                  <React.Fragment key={topping}>
                    <label>
                      <input type="checkbox" name="topping" value={topping} />
                      {topping}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customBowlOptions.availableOptions?.dressings && (
              <fieldset>
                <legend>Dressings (required)</legend>
                {customBowlOptions.availableOptions.dressings.map((dressing) => (
                  <React.Fragment key={dressing}>
                    <label>
                      <input type="checkbox" name="dressing" value={dressing} />
                      {dressing}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addCustomItem(customBowlRef.current, "Custom Bowl");
              }}
            >
              Add Custom Bowl to Cart
            </button>
          </form>
        )}

        <hr className="ohr" />

        {/* SIGNATURE PITAS - Dynamic from API */}
        {loading ? (
          <div>Loading menu...</div>
        ) : (
          <form className="oform" id="sigPitaForm" ref={sigPitaRef}>
            <h2>Signature Pitas</h2>

            {signaturePitas.map((pita) => (
              <fieldset key={pita._id}>
                <legend>{pita.name}</legend>
                {pita.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{pita.description}</p>}
                {pita.defaultToppings && pita.defaultToppings.map((topping) => (
                  <React.Fragment key={topping}>
                    <label>
                      <input 
                        type="checkbox" 
                        name={`sig-${pita._id}-topping`}
                        value={topping} 
                        defaultChecked 
                      />
                      {topping}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            ))}

            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addSignatureItem(sigPitaRef.current);
              }}
            >
              Add Signature Pita(s) to Cart
            </button>
          </form>
        )}

        <hr className="ohr" />

        {/* CUSTOM PITAS - Dynamic from API */}
        {loading || !customPitaOptions ? (
          <div>Loading menu...</div>
        ) : (
          <form className="oform" id="customPitaForm" data-custom="true" ref={customPitaRef}>
            <h2>Customize Your Own Pita</h2>

            {customPitaOptions.availableOptions?.proteins && (
              <fieldset>
                <legend>Proteins (required)</legend>
                {customPitaOptions.availableOptions.proteins.map((protein) => (
                  <React.Fragment key={protein}>
                    <label>
                      <input type="checkbox" name="protein" value={protein} />
                      {protein}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customPitaOptions.availableOptions?.spreads && (
              <fieldset>
                <legend>Spreads & Dips</legend>
                {customPitaOptions.availableOptions.spreads.map((spread) => (
                  <React.Fragment key={spread}>
                    <label>
                      <input type="checkbox" name="spread" value={spread} />
                      {spread}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customPitaOptions.availableOptions?.toppings && (
              <fieldset>
                <legend>Toppings</legend>
                {customPitaOptions.availableOptions.toppings.map((topping) => (
                  <React.Fragment key={topping}>
                    <label>
                      <input type="checkbox" name="topping" value={topping} />
                      {topping}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            {customPitaOptions.availableOptions?.dressings && (
              <fieldset>
                <legend>Dressings (required)</legend>
                {customPitaOptions.availableOptions.dressings.map((dressing) => (
                  <React.Fragment key={dressing}>
                    <label>
                      <input type="checkbox" name="dressing" value={dressing} />
                      {dressing}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            )}

            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addCustomItem(customPitaRef.current, "Custom Pita");
              }}
            >
              Add Custom Pita to Cart
            </button>
          </form>
        )}

        <hr className="ohr" />

        <h1 className="option-heading">Drinks Menu</h1>

        {/* DRINKS FORM - Dynamic from API */}
        {loading ? (
          <div>Loading menu...</div>
        ) : (
          <form className="oform" id="drinksForm" ref={drinksRef}>
            <h2>Drinks</h2>

            {drinks.map((drink) => (
              <fieldset key={drink._id}>
                <legend>{drink.name}</legend>
                {drink.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{drink.description}</p>}
                {drink.sizes && drink.sizes.map((size) => (
                  <React.Fragment key={size.name}>
                    <label>
                      <input 
                        type="checkbox" 
                        name={size.name.toLowerCase()} 
                        value={size.name.toLowerCase()} 
                        defaultChecked={false} 
                      />
                      {size.name}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
              </fieldset>
            ))}

            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addDrinks(drinksRef.current);
              }}
            >
              Add Drink(s) to Cart
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default Order;
