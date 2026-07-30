import React, { useState, useEffect } from "react";

const states = ["All", "Kansas", "California", "Texas", "New York", "Florida"];

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState("All");
  const loggedIn = !!sessionStorage.getItem("username");

  const fetchDealers = async (selectedState) => {
    const endpoint =
      selectedState === "All"
        ? `/djangoapp/get_dealers`
        : `/djangoapp/get_dealers/${selectedState}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    setDealers(json.dealers || []);
  };

  useEffect(() => {
    fetchDealers(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="container">
      <h1>Our Dealers</h1>
      <label htmlFor="state-filter">Filter by State: </label>
      <select
        id="state-filter"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <table style={{ width: "100%", marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            {loggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealers.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                <a href={`/dealer/${d.id}`}>{d.full_name}</a>
              </td>
              <td>{d.city}</td>
              <td>{d.state}</td>
              <td>{d.zip}</td>
              {loggedIn && (
                <td>
                  <a href={`/postreview/${d.id}`}>Review Dealer</a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
