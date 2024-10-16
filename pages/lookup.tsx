import { useEffect, useState } from "react";

export default function Lookup() {
  useEffect(() => {
    // fetch("/api/add-entry", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     vin: "1HGCM82633A000000",
    //     licensePlate: "ABC123",
    //     year: "2003",
    //     maker: "Honda",
    //     model: "Accord",
    //     color: "Silver",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data));

    // fetch("/api/delete-entry", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: "7",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data));

    fetch("/api/get-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 2,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1>lookup</h1>
    </div>
  );
}
