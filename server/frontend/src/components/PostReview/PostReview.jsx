import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PostReview = () => {
  const { id } = useParams();
  const [review, setReview] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [cars, setCars] = useState([]);
  const username = sessionStorage.getItem("username") || "";

  useEffect(() => {
    fetch(`/djangoapp/get_cars`)
      .then((res) => res.json())
      .then((json) => setCars(json.CarModels || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: username,
      dealership: id,
      review,
      purchase: true,
      purchase_date: new Date().toISOString().slice(0, 10),
      car_make: carMake,
      car_model: carModel,
      car_year: carYear,
    };
    await fetch(`/djangoapp/add_review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    window.location.href = `/dealer/${id}`;
  };

  return (
    <div className="container">
      <h1>Post a Review</h1>
      <form className="register-form" onSubmit={submit} style={{ maxWidth: 480 }}>
        <label htmlFor="review">Review</label>
        <textarea
          id="review"
          rows={5}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />

        <label htmlFor="carMake">Car Make</label>
        <input id="carMake" value={carMake} onChange={(e) => setCarMake(e.target.value)} required />

        <label htmlFor="carModel">Car Model</label>
        <input id="carModel" value={carModel} onChange={(e) => setCarModel(e.target.value)} required />

        <label htmlFor="carYear">Car Year</label>
        <input id="carYear" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)} required />

        <button type="submit" className="register-btn">Post Review</button>
      </form>
    </div>
  );
};

export default PostReview;
