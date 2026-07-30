import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const dRes = await fetch(`/djangoapp/dealer/${id}`);
      const dJson = await dRes.json();
      setDealer(dJson.dealer);

      const rRes = await fetch(`/djangoapp/reviews/dealer/${id}`);
      const rJson = await rRes.json();
      setReviews(rJson.reviews || []);
    };
    load();
  }, [id]);

  if (!dealer) return <div className="container">Loading dealer...</div>;

  return (
    <div className="container">
      <h1>{dealer.full_name}</h1>
      <p>{dealer.city}, {dealer.state} {dealer.zip}</p>

      <h2>Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r, idx) => (
        <div key={idx} className="team-card" style={{ textAlign: "left", marginBottom: "1rem" }}>
          <p><strong>{r.name}</strong> — {r.sentiment}</p>
          <p>{r.review}</p>
          <p><em>{r.car_make} {r.car_model} ({r.car_year})</em></p>
        </div>
      ))}
    </div>
  );
};

export default Dealer;
