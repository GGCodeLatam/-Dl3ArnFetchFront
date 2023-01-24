import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import logo from "./logo.svg";

function App() {
  const address = "0x7287cFb7Cd25B1d0DED132877c85f45e7DB920dc";
  const chain = "0x89";
  const [cursor, setCursor] = useState(null);
  const [NFTs, setNFTs] = useState([]);

  function getImgUrl(metadata) {
    if (!metadata) return logo;

    let meta = JSON.parse(metadata);

    if (!meta.image) return logo;

    if (!meta.image.includes("ipfs://")) {
      return meta.image;
    } else {
      return "https://ipfs.io/ipfs/" + meta.image.substring(7);
    }
  }

  async function fetchNFTs() {
    let res;
    if (cursor) {
      res = await axios.get(`http://localhost:3000/allNft`, {
        params: { address: address, chain: chain, cursor: cursor },
      });
    } else {
      res = await axios.get(`http://localhost:3000/allNft`, {
        params: { address: address, chain: chain },
      });
    }

    console.log(res);

    let n = NFTs;
    setNFTs(n.concat(res.data.result.result));
    setCursor(res.data.result.cursor);
    console.log(res);
  }

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="App">
      <div style={{ fontSize: "23px", fontWeight: "700" }}>
        Get NFTs by contract
      </div>
      <div>
        {NFTs.length > 0 && (
          <>
            <div className="results">
              {NFTs?.map((e, i) => {
                return (
                  <>
                    <div style={{ width: "70px" }}>
                      <img
                        loading="lazy"
                        width={70}
                        src={getImgUrl(e.metadata)}
                        alt={`${i}image`}
                        style={{ borderRadius: "5px", marginTop: "10px" }}
                      />
                      <div key={i} style={{ fontSize: "10px" }}>
                        {`${e.name}\n${e.token_id}`}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            {cursor && (
              <>
                <button className="bu" onClick={fetchNFTs}>
                  Load More
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
