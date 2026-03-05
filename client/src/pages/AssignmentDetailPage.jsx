import { executeQuery, submitQuery } from "../services/api";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAssignmentById } from "../services/api";
import { getSampleData } from "../services/api";
import { getHint } from "../services/api";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowSuccess(false);
    setResult(null);
    setQuery("");

    // Check if already completed
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    setIsCompleted(completed.includes(Number(id)));

    getAssignmentById(id)
      .then((res) => {
        setAssignment(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    getSampleData(id)
      .then((res) => {
        setSampleData(res.data);
      })
      .catch((err) => {
        console.log("Sample Data Error:", err);
      });
  }, [id]);

  if (loading) return <div className="loading-state">Initializing Studio...</div>;
  if (!assignment) return <div className="error-state">Assignment not found. <Link to="/">Go Back</Link></div>;

  const handleExecute = async () => {
    if (executing) return;

    if (!query.trim()) {
      setError("Please enter a SQL query to execute.");
      return;
    }

    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      // Use the submission endpoint for validation
      const res = await submitQuery(id, query);
      setResult({ rows: res.data.rows, rowCount: res.data.rowCount });

      if (res.data.success) {
        setShowSuccess(true);
        // Persist completion
        const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        if (!completed.includes(Number(id))) {
          completed.push(Number(id));
          localStorage.setItem('completedChallenges', JSON.stringify(completed));
          setIsCompleted(true);
        }
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "An error occurred while executing your query.";
      setError(message);
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = () => {
    setLoadingHint(true);
    getHint(id, assignment.description)
      .then((res) => {
        setHint(res.data.hint);
      })
      .catch(() => {
        setError("Failed to fetch hint.");
      })
      .finally(() => {
        setLoadingHint(false);
      });
  };

  const goToNext = () => {
    const nextId = Number(id) + 1;
    navigate(`/assignment/${nextId}`);
  };

  return (
    <div className="detail">
      <div className="detail__container">

        {/* LEFTSIDE: CHALLENGE INFO & SCHEMA */}
        <aside className="detail__left">
          <div className="detail__sidebar-content">
            <Link to="/" className="detail__back-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Challenges
            </Link>

            <header>
              <div className="detail__status-badge">
                <span className={`detail__difficulty detail__difficulty--${assignment.difficulty?.toLowerCase()}`}>
                  {assignment.difficulty}
                </span>
                {isCompleted && (
                  <span className="detail__completed-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    SOLVED
                  </span>
                )}
              </div>
              <h1 className="detail__title">{assignment.title}</h1>
              <p className="detail__description">{assignment.description}</p>
            </header>

            {/* TABLE SCHEMA SECTION */}
            {sampleData && sampleData.schema && (
              <section className="detail__section">
                <h3>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3zM3 9h18M9 3v18" />
                  </svg>
                  Table Schema
                </h3>
                <ul className="detail__schema-list">
                  {sampleData.schema.map((col, index) => (
                    <li key={index}>
                      {col.column} <span>({col.type})</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* SAMPLE DATA SECTION */}
            {sampleData && sampleData.rows && sampleData.rows.length > 0 && (
              <section className="detail__section">
                <h3>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Sample Data
                </h3>
                <div className="detail__sample-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(sampleData.rows[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.rows.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((val, i) => (
                            <td key={i}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* HINT SECTION */}
            <div className="detail__section">
              <button
                className="detail__btn detail__btn--secondary"
                onClick={handleGetHint}
                disabled={loadingHint}
              >
                {loadingHint ? "Fetching..." : "Get Hint"}
              </button>

              {hint && (
                <div className="detail__hint-box">
                  {hint}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHTSIDE: EDITOR & RESULTS */}
        <main className="detail__right">
          <div className="detail__editor-container">
            <textarea
              placeholder="-- Write your SQL query here
SELECT * FROM ..."
              value={query}
              spellCheck="false"
              autoFocus
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
            />
          </div>

          <div className="detail__controls">
            <button
              className="detail__btn detail__btn--primary"
              disabled={executing}
              onClick={handleExecute}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {executing ? "Verifying..." : "Submit Query"}
            </button>
          </div>

          <div className="detail__result-panel">
            {error && (
              <div className="detail__error">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {result && result.rows && (
              <div className="detail__result-content">
                <h3>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Execution Results
                </h3>
                <div className="detail__table-scroll">
                  {result.rows.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(result.rows[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i}>{String(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-results">No rows returned.</div>
                  )}
                </div>
                <span className="detail__row-count">{result.rowCount} Rows Found</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-modal__overlay" onClick={() => setShowSuccess(false)} />
          <div className="success-modal__content">
            <div className="success-modal__icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Correct Solution!</h2>
            <p>You have successfully solved the challenge "{assignment.title}".</p>
            <div className="success-modal__actions">
              <button
                className="detail__btn detail__btn--primary"
                onClick={goToNext}
              >
                Next Challenge
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="detail__btn detail__btn--secondary"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailPage;