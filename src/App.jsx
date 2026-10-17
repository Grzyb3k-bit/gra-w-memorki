import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [game, setGame] = useState(false);
  const [obecny, setobecny] = useState(0);
  const [active, setactive] = useState(0);
  const [round, setround] = useState(false);
  const [tab, setTab] = useState([]);
  const [clear, setclaer] = useState([]);
  const [lose, setlose] = useState(false);
  const [bestscore, setbestscore] = useState(0);
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState("");
  const [nextQuote, setNextQuote] = useState("");

  // Pobieranie cytatu z API Ninjas
  async function getQuote() {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v2/randomquotes?categories=success",
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_QUOTES_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Nie udało się pobrać cytatu");
      }

      const data = await response.json();
      return data[0].quote;
    } catch (error) {
      console.error("Błąd pobierania cytatu:", error);
      return "";
    }
  }

  // Przygotowanie cytatu przed przegraną
  useEffect(() => {
    let cancelled = false;

    async function prepareQuote() {
      const newQuote = await getQuote();

      if (!cancelled) {
        setNextQuote(newQuote);
      }
    }

    prepareQuote();

    return () => {
      cancelled = true;
    };
  }, []);

  // Wyświetlanie sekwencji przycisków
  useEffect(() => {
    let timeouts = [];

    if (tab.length > 0 && game) {
      setround(true);

      tab.forEach((item, index) => {
        timeouts.push(
          setTimeout(() => {
            setactive(item);

            timeouts.push(
              setTimeout(() => {
                setactive(0);
              }, 500),
            );
          }, index * 600),
        );
      });

      timeouts.push(
        setTimeout(() => {
          setround(false);
        }, tab.length * 600),
      );
    }

    setclaer(timeouts);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [tab]);

  function getRandomInt() {
    return Math.floor(Math.random() * 4 + 1);
  }

  const Startgame = () => {
    clear.forEach(clearTimeout);

    setlose(false);
    setMessage("");
    setQuote("");
    setGame(true);
    setTab([getRandomInt()]);
    setobecny(0);
    setactive(0);
  };

  const reset = () => {
    clear.forEach(clearTimeout);

    setactive(0);
    setTab([]);
    setGame(false);
    setround(false);
    setlose(false);
    setMessage("");
    setQuote("");
    setclaer([]);
  };

  function btn(id) {
    if (!game || round) return;

    if (tab[obecny] === id) {
      if (obecny + 1 === tab.length) {
        if (tab.length % 5 === 0) {
          setMessage(`Udało Ci się osiągnąć poziom ${tab.length}!`);

          setTimeout(() => {
            setMessage("");
          }, 2000);
        }

        setTab([...tab, getRandomInt()]);
        setobecny(0);
      } else {
        setobecny((prev) => prev + 1);
      }
    } else {
      setGame(false);
      setactive(-1);
      setlose(true);
      setMessage("");

      // Wyświetl wcześniej pobrany cytat
      setQuote(nextQuote);

      // Pobierz kolejny cytat w tle na następną przegraną
      setNextQuote("");

      getQuote().then((newQuote) => {
        setNextQuote(newQuote);
      });

      if (tab.length > bestscore) {
        setbestscore(tab.length);
      }

      setTimeout(() => {
        setactive(0);
      }, 200);
    }
  }

  return (
    <div className="box">
      {message && (
        <div className="message">
          <p>{message}</p>
        </div>
      )}

      {lose && quote && (
        <div className="message">
          <p>{quote}</p>
        </div>
      )}

      {bestscore > 1 && (
        <div className="best">
          <p>Best score: {bestscore}</p>
        </div>
      )}

      <div className="gamebox">
        {!game && (
          <button onClick={Startgame} className="start">
            Start
          </button>
        )}

        <button
          disabled={!game || round}
          onClick={() => btn(1)}
          className={`red btn ${active === 1 ? "active" : ""}`}
        >
          1
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(2)}
          className={`green btn ${active === 2 ? "active" : ""}`}
        >
          2
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(3)}
          className={`blue btn ${active === 3 ? "active" : ""}`}
        >
          3
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(4)}
          className={`yellow btn ${active === 4 ? "active" : ""}`}
        >
          4
        </button>

        <div className="level">level: {tab.length}</div>

        <button className="rest_btn" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="info">{lose && "Lose"}</p>
    </div>
  );
}

export default App;
