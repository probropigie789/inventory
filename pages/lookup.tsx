import { useEffect, useState } from "react";

export default function Lookup() {
  const [page, setPage] = useState<number>(1);
  const [cars, setCars] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    fetch("/api/get-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: page,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        setCars(body.data.cars);
        setTotalPages(body.data.totalPages);
        setCount(body.data.count);
      });
  }, [page]);

  return (
    <div>
      <h1>lookup</h1>
      {JSON.stringify(cars)}
      {JSON.stringify(totalPages)}
      {JSON.stringify(count)}
      {JSON.stringify(page)}
    </div>
  );
}

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
