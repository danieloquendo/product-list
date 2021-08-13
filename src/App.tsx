import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://external-middleware.herokuapp.com";

const App = () => {
  const [products, setProducts] = useState<any[]>([]);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const segment = urlParams.get("segment") as string;

  useEffect(() => {
    let mounted = true;
    getProducts(segment)
      .then((productsResult) => {
        if (mounted) {
          setProducts(productsResult);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="App">
      <ul>
        {products.map((product) => (
          <li>
            {product.productId} - {product.productTitle}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getProducts = async (segment: string): Promise<any[]> => {
  const url = `${API_URL}?brand=samsung&segment=${segment}`;
  const requestInit: RequestInit = { method: "GET", redirect: "follow" };
  try {
    const products = await fetch(url, requestInit).then((res) => res.json());
    return products;
  } catch (error) {
    throw new Error(error);
  }
};

export default App;
