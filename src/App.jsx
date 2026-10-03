import { useEffect, useState } from "react";
import "./App.css";

const quotes = [
  "Nie poddawaj się. Każda próba przybliża Cię do celu.",
  "Porażka to nie koniec. To kolejna lekcja.",
  "Nie musisz być najlepszy. Musisz być lepszy niż wczoraj.",
  "Każdy błąd jest krokiem do sukcesu.",
  "Najważniejsze to próbować dalej.",
  "Nie bój się porażki. Bój się rezygnacji.",
  "Każdy dzień to nowa szansa.",
  "Małe kroki prowadzą do wielkich rzeczy.",
  "Nie zatrzymuj się tylko dlatego, że droga jest trudna.",
  "Sukces zaczyna się od decyzji, żeby spróbować.",
];

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

  useEffect(() => {
    let timeouts = [];

    setround(true);

    console.log("Btn", tab);

    tab.map((item, index) => {
      timeouts.push(
        setTimeout(() => {
          setactive(item);

          setTimeout(() => {
            setactive(0);
          }, 500);
        }, index * 600),
      );
    });

    setclaer(timeouts);

    setTimeout(() => {
      setround(false);
    }, tab.length * 600);
  }, [tab]);

  function getRandomInt() {
    return Math.floor(Math.random() * 4 + 1);
  }

  const Startgame = () => {
    setlose(false);
    setMessage("");
    setGame(true);
    setTab([getRandomInt()]);
    setobecny(0);
  };

  const reset = () => {
    setactive(0);
    setTab([]);
    setGame(false);
    setround(false);
    setlose(false);
    setMessage("");

    clear.forEach(clearTimeout);
    setclaer([]);
  };

  function btn(id) {
    // poprawny przycisk
    if (tab[obecny] == id) {
      // cała sekwencja została wykonana
      if (obecny + 1 == tab.length) {
        if (tab.length % 5 === 0) {
          setMessage(`Udało Ci się osiągnąć poziom ${tab.length}!`);
          setTimeout(() => {
            setMessage("");
          }, 2000);
        }
        // dodanie kolejnego elementu
        setTab([...tab, getRandomInt()]);
        // zaczynamy sprawdzanie od początku
        setobecny(0);
      } else {
        // przechodzimy do kolejnego elementu
        setobecny((prev) => prev + 1);
      }
    }

    // zły przycisk
    else {
      setGame(false);
      setactive(-1);
      if (tab.length > bestscore) {
        setbestscore(tab.length);
      }
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMessage(randomQuote);
      setlose(true);
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

      {bestscore > 1 && (
        <div className="best">
          <p>najlepszy wynik: {bestscore}</p>
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
          className={`red btn ${active == 1 ? "active" : ""}`}
        >
          1
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(2)}
          className={`green btn ${active == 2 ? "active" : ""}`}
        >
          2
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(3)}
          className={`blue btn ${active == 3 ? "active" : ""}`}
        >
          3
        </button>

        <button
          disabled={!game || round}
          onClick={() => btn(4)}
          className={`yellow btn ${active == 4 ? "active" : ""}`}
        >
          4
        </button>

        <div className="level">Poziom: {tab.length}</div>

        <button className="rest_btn" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="info">{lose && "przegrana"}</p>
    </div>
  );
}

export default App;
