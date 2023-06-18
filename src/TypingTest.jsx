import { useRef, useState } from "react";

const SAMPLE_TEXTS = [
  "A teacher's professional duties may extend beyond formal teaching. Outside of the classroom teachers may accompany students on field trips, supervise study halls, help with the organization of school functions, and serve as supervisors for extracurricular activities. In some education systems, teachers may have responsibility for student discipline.",
  "Income before securities transactions was up 10.8 percent from $13.49 million in 1982 to $14.95 million in 1983. Earnings per share (adjusted for a 10.5 percent stock dividend distributed on August 26) advanced 10 percent to $2.39 in 1983 from $2.17 in 1982. Earnings may rise for 7 years. Hopefully, earnings per share will grow another 10 percent. Kosy, Klemin, and Bille began selling on May 23, 1964. Their second store was founded in Renton on August 3, 1965. From 1964 to 1984, they opened more than 50 stores through-out the country. As they expanded, 12 regional offices had to be organized. Each of these 12 regional offices had to be organized. Each of these 12 regions employs from 108 to 578 people.",
];

function TypingTest() {
  const SAMPLE_TEXT = SAMPLE_TEXTS[0];
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const [text, setText] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeAllowed, setTimeAllowed] = useState(30);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleStart = () => {
    // reset everything
    setIsRunning(true);
    setText("");
    setTimer(0);
    setAccuracy(0);
    setWpm(0);
    // focus input
    inputRef.current.focus();
  };

  const handleTyping = () => {
    if (text.length === 1) {
      // starts timer when user starts typing
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          //stop after 60 seconds or whatever time is allowed
          if (prevTimer === timeAllowed) {
            setText((prevtext) => {
              handleStop(prevtext, prevTimer);
              prevtext;
            });
          }
          return prevTimer + 1;
        });
      }, 1000);
    }
  };

  // prevent paste
  const handlePaste = (e) => {
    e.preventDefault();
  };

  // on stop
  const handleStop = (text, timer) => {
    setIsRunning(false);
    clearInterval(intervalRef.current);

    // get typed words
    const typedWords = text.trim().split(" ");
    console.log({ text, typedWords, len: typedWords.length });
    const typedWordslength = typedWords.length;
    // get sample words
    const sampleWords = SAMPLE_TEXT.split(" ");

    let correctWords = 0;
    let tw_i = 0;
    let sw_i = 0;

    while (tw_i < typedWordslength) {
      // if same word
      if (typedWords[tw_i] === sampleWords[sw_i]) {
        correctWords++;
      }
      // if same word but different case do nothing
      else if (
        typedWords[tw_i].toLowerCase() === sampleWords[sw_i].toLowerCase()
      ) {
        // do nothing
      } else {
        // check if next word is == sample word
        if (
          tw_i + 1 < typedWordslength &&
          typedWords[tw_i + 1].toLowerCase() === sampleWords[sw_i].toLowerCase()
        ) {
          tw_i += 1;
        }
        // check if next +2 word is == sample word
        else if (
          tw_i + 2 < typedWordslength &&
          typedWords[tw_i + 2].toLowerCase() === sampleWords[sw_i].toLowerCase()
        ) {
          tw_i += 2;
        }

        // in case user missed something
        // check if next word is == sample word  +1
        else if (
          sw_i + 2 < sampleWords.length &&
          typedWords[tw_i].toLowerCase() === sampleWords[sw_i + 1].toLowerCase()
        ) {
          sw_i += 1;
        }
        // check if next word is == sample word +2
        else if (
          sw_i + 2 < sampleWords.length &&
          typedWords[tw_i].toLowerCase() === sampleWords[sw_i + 2].toLowerCase()
        ) {
          sw_i += 2;
        }
      }

      tw_i++;
      sw_i++;
    }

    // calculate accuracy
    const _accuracy = (correctWords / typedWordslength) * 100;
    console.log("correctWords", {
      correctWords,
      typedWords: typedWordslength,
      _accuracy,
    });
    setAccuracy(_accuracy.toFixed(2));

    // calculate word per minute
    const minutes = timer / 60;
    const calculatedWpm = Math.round(typedWordslength / minutes);
    console.log("calculatedWpm", {
      timer,
      typedWordslength,
      calculatedWpm,
      minutes,
    });
    setWpm(calculatedWpm);
  };

  return (
    <div>
      <h1>Typing Test</h1>
      <div className="sample-text">{SAMPLE_TEXT}</div>
      <textarea
        className="typing-box"
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleTyping}
        disabled={!isRunning}
        onPaste={handlePaste}
      />
      <div className="button-holder">
        {!isRunning ? (
          <>
            <div className="time-selector">
              {[30, 60, 120].map((sec) => (
                <div
                  key={sec}
                  className={timeAllowed === sec ? "active" : ""}
                  onClick={() => setTimeAllowed(sec)}
                >
                  {sec} sec
                </div>
              ))}
            </div>
            <button onClick={handleStart}>Start</button>{" "}
          </>
        ) : (
          <>
            <div />
            <button onClick={() => handleStop(text)}>Stop</button>
          </>
        )}
      </div>

      <div className="stats">
        {timer > 0 && <div>{timer}sec</div>}
        {accuracy > 0 && <div>Accuracy: {accuracy}%</div>}
        {wpm > 0 && <div>WPM: {wpm}</div>}
      </div>
    </div>
  );
}

export default TypingTest;
