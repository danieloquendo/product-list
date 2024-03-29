import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import "./App.scss";

const API_URL = "https://external-middleware.herokuapp.com";
const DOMAIN = "https://www.exito.com";

const App = () => {
  const [products, setProducts] = useState<any[]>([]);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const segment = urlParams.get("segment") as string;
  const brand = urlParams.get("brand") as string;

  useEffect(() => {
    let mounted = true;
    getProducts(brand, segment)
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
  }, [brand, segment]);

  return (
    <div className="App">
      <ul className="mystyle-products">
        {products.map((product) => {
          return product.items.map((item: any) => (
            <li className="product" key={item.itemId}>
              <a href={getUrl(product.link)}>
                <span className="onsale">Sale!</span>
                <img
                  className="attachment-shop_catalog"
                  src={item.images[0].imageUrl}
                  alt={product.productName}
                />
                <h3>{item.name}</h3>
                {item.sellers.map((seller: any) => (
                  <div key={seller.sellerId}>
                    <span className="price">
                      <del>
                        <span className="amount">
                          <NumericFormat
                            value={seller.commertialOffer.Price}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </span>
                      </del>
                      <ins>
                        <span className="amount">
                          <NumericFormat
                            value={seller.commertialOffer.PriceWithoutDiscount}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </span>
                      </ins>
                    </span>
                  </div>
                ))}
              </a>
            </li>
          ));
        })}
      </ul>
    </div>
  );
};

const getProducts = async (brand: string, segment: string): Promise<any[]> => {
  const url = `${API_URL}?brand=${brand}&segment=${segment}&from=1&to=20`;
  const requestInit: RequestInit = { method: "GET", redirect: "follow" };
  try {
    const products = await fetch(url, requestInit).then((res) => res.json());
    return products;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

const getUrl = (url: string): string => {
  const newUrl = new URL(url);
  return `${DOMAIN}${newUrl.pathname}`;
};

export default App;
