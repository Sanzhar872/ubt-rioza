import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { pingServer } from "../api";
import "./ServerWakeScreen.css";

// The free-tier backend sleeps when idle and takes up to a minute to boot.
// Don't flash the screen if the server answers quickly.
const GRACE_MS = 700;
const RETRY_DELAY_MS = 2000;
const GIVE_UP_MS = 150_000;
const EXIT_MS = 700;

type Status = "waking" | "ready" | "failed";

const STAGES = [
  { from: 0, text: "Будим сервер…" },
  { from: 6, text: "Разогреваем базу данных…" },
  { from: 22, text: "Собираем темы и вопросы…" },
  { from: 45, text: "Почти готово, ещё чуть-чуть…" },
];

const FACTS = [
  "Казахское ханство образовалось около 1465 года — его основали султаны Керей и Жәнібек.",
  "Тәуке хан создал свод законов «Жеті жарғы» на рубеже XVII–XVIII веков.",
  "Аңырақайская битва 1730 года стала одной из ключевых побед казахов над джунгарами.",
  "Мавзолей Ходжи Ахмеда Ясави в Туркестане строили по приказу Тимура в конце XIV века.",
  "Аль-Фараби, «Второй учитель» после Аристотеля, родился в окрестностях Отрара.",
  "«Золотой человек» — сакский воин — найден в кургане Иссык в 1969 году.",
  "Шанырак — верхний купол юрты — символ дома, семьи и памяти предков.",
];

const STARS = Array.from({ length: 54 }, (_, i) => {
  const rand = (n: number) => {
    const x = Math.sin(i * 97.13 + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: rand(1) * 100,
    top: rand(2) * 68,
    size: 1 + rand(3) * 2,
    delay: rand(4) * 5,
    duration: 2.5 + rand(5) * 3.5,
  };
});

const SPOKE_COUNT = 16;
const SPOKES = Array.from({ length: SPOKE_COUNT }, (_, i) => {
  const angle = (i / SPOKE_COUNT) * Math.PI * 2 - Math.PI / 2;
  const at = (r: number) => ({
    x: 100 + Math.cos(angle) * r,
    y: 100 + Math.sin(angle) * r,
  });
  return { i, a: at(26), b: at(78) };
});

const ORBIT_DOTS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  return { i, x: 100 + Math.cos(angle) * 94, y: 100 + Math.sin(angle) * 94 };
});

export default function ServerWakeScreen({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("waking");
  const [attempt, setAttempt] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [overlayShown, setOverlayShown] = useState(false);
  const [exited, setExited] = useState(false);

  // Poll the backend until it answers or we give up.
  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    async function run() {
      while (!cancelled) {
        try {
          await pingServer();
          if (!cancelled) setStatus("ready");
          return;
        } catch {
          if (cancelled) return;
          if (Date.now() - started > GIVE_UP_MS) {
            setStatus("failed");
            return;
          }
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Only reveal the screen if the server is still silent after the grace period.
  useEffect(() => {
    if (status === "ready") return;
    const t = setTimeout(() => setOverlayShown(true), GRACE_MS);
    return () => clearTimeout(t);
  }, [status]);

  // Let the exit animation play, then drop the overlay.
  useEffect(() => {
    if (status !== "ready" || !overlayShown) return;
    const t = setTimeout(() => setExited(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [status, overlayShown]);

  function retry() {
    setStartedAt(Date.now());
    setStatus("waking");
    setAttempt((a) => a + 1);
  }

  return (
    <>
      {status === "ready" && children}
      {overlayShown && !exited && (
        <WakeScreen status={status} startedAt={startedAt} onRetry={retry} />
      )}
    </>
  );
}

function WakeScreen({
  status,
  startedAt,
  onRetry,
}: {
  status: Status;
  startedAt: number;
  onRetry: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FACTS.length));

  useEffect(() => {
    if (status !== "waking") return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    const id = setInterval(() => setFactIndex((i) => (i + 1) % FACTS.length), 6500);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  const stage = [...STAGES].reverse().find((s) => elapsed >= s.from) ?? STAGES[0];
  // Honest-ish progress: we can't know the real boot time, so ease towards 92%.
  const progress = status === "ready" ? 1 : 0.92 * (1 - Math.exp(-elapsed / 28));
  const mm = Math.floor(elapsed / 60);
  const ss = String(elapsed % 60).padStart(2, "0");

  const title =
    status === "ready" ? "Готово!" : status === "failed" ? "Сервер не отвечает" : stage.text;
  const overline =
    status === "ready" ? "Қош келдіңіз" : status === "failed" ? "Сервер жауап бермейді" : "Сервер оянып жатыр";

  return (
    <div
      className={`wake-screen is-${status}`}
      role="status"
      aria-live="polite"
      aria-busy={status === "waking"}
    >
      <div className="wake-sky" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="wake-star"
            style={
              {
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                "--delay": `${s.delay}s`,
                "--dur": `${s.duration}s`,
              } as CSSProperties
            }
          />
        ))}
        <Steppe />
      </div>

      <div className="wake-content">
        <div className="wake-emblem" aria-hidden="true">
          <div className="wake-glow" />
          <Shanyrak />
        </div>

        <p className="wake-overline">{overline}</p>
        <h2 className="wake-title" key={title}>
          {title}
        </h2>

        {status === "failed" ? (
          <>
            <p className="wake-hint">
              Бесплатный сервер не проснулся вовремя или пропало соединение. Проверьте интернет и
              попробуйте ещё раз.
            </p>
            <button type="button" className="wake-retry" onClick={onRetry}>
              Попробовать снова
            </button>
          </>
        ) : (
          <>
            <p className="wake-hint">
              Сайт работает на бесплатном хостинге и «засыпает» без посетителей. Первый заход
              занимает до минуты — дальше всё будет мгновенно.
            </p>
            <div className="wake-progress" aria-hidden="true">
              <div className="wake-progress-bar" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <p className="wake-timer">
              {mm}:{ss}
            </p>
            <div className="wake-fact-box">
              <span className="wake-fact-label">Знаете ли вы?</span>
              <p className="wake-fact" key={factIndex}>
                {FACTS[factIndex]}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Shanyrak() {
  return (
    <svg viewBox="0 0 200 200" className="wake-shanyrak">
      <circle className="wake-ring-outer" cx="100" cy="100" r="94" />
      {ORBIT_DOTS.map((d) => (
        <circle key={d.i} className="wake-orbit-dot" cx={d.x} cy={d.y} r="1.6" />
      ))}
      <circle className="wake-ring" cx="100" cy="100" r="80" />
      <circle className="wake-ring wake-ring-thin" cx="100" cy="100" r="26" />

      {SPOKES.map((s) => (
        <line
          key={s.i}
          className="wake-spoke"
          x1={s.a.x}
          y1={s.a.y}
          x2={s.b.x}
          y2={s.b.y}
          style={{ "--i": s.i } as CSSProperties}
        />
      ))}

      {/* the two crossed beams that hold up a real shanyrak */}
      <line className="wake-beam" x1="20" y1="100" x2="180" y2="100" />
      <line className="wake-beam" x1="100" y1="20" x2="100" y2="180" />

      <circle className="wake-core" cx="100" cy="100" r="9" />
    </svg>
  );
}

function Steppe() {
  return (
    <svg className="wake-steppe" viewBox="0 0 800 160" preserveAspectRatio="xMidYMax slice">
      <path
        className="wake-hill wake-hill-far"
        d="M0 110 C120 70 240 100 360 84 C500 64 620 104 800 76 V160 H0 Z"
      />
      <path
        className="wake-hill wake-hill-near"
        d="M0 132 C150 108 260 138 400 122 C540 106 660 140 800 118 V160 H0 Z"
      />
      {/* a lone yurt with a lit door */}
      <g transform="translate(590 128)">
        <path className="wake-yurt" d="M-34 0 V-20 Q-32 -42 0 -48 Q32 -42 34 -20 V0 Z" />
        <path className="wake-yurt-band" d="M-34 -20 Q0 -14 34 -20" />
        <rect className="wake-door" x="-6" y="-16" width="12" height="16" rx="6" />
      </g>
    </svg>
  );
}
