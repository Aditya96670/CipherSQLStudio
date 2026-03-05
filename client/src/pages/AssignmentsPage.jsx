import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignments } from "../services/api";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    // Load completed challenges from localStorage
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    setCompletedIds(completed);

    getAssignments()
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assignments:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-state">Loading Mastery Center...</div>;

  const solvedCount = completedIds.length;
  const remainingCount = Math.max(0, assignments.length - solvedCount);

  return (
    <div className="assignments">
      <header className="assignments-hero">
        <div className="assignments-hero__content">
          <h1 className="assignments-hero__title">SQL Mastery</h1>
          <p className="assignments-hero__subtitle">
            Sharpen your query skills with curated database challenges.
          </p>
        </div>
        <div className="assignments-hero__gradient"></div>
      </header>

      <div className="assignments__container">
        <div className="assignments__header">
          <h2 className="assignments__list-title">Active Assignments</h2>
          <div className="assignments__stats">
            <span className="assignments__count">
              {assignments.length} Challenges
            </span>
            {solvedCount > 0 && (
              <span className="assignments__remaining">
                {remainingCount} Remaining
              </span>
            )}
          </div>
        </div>

        <div className="assignments__list">
          {assignments.map((item) => {
            const isCompleted = completedIds.includes(Number(item.id));

            return (
              <Link
                to={`/assignment/${item.id}`}
                key={item.id}
                className={`assignment-card assignment-card--${item.difficulty?.toLowerCase()} ${isCompleted ? 'assignment-card--completed' : ''}`}
              >
                <div className="assignment-card__content">
                  <div className="assignment-card__header">
                    <h3 className="assignment-card__title">{item.title}</h3>
                    {isCompleted && (
                      <span className="assignment-card__status-tag">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        COMPLETE
                      </span>
                    )}
                  </div>
                  <p className="assignment-card__description">{item.description}</p>
                </div>
                <div className="assignment-card__footer">
                  <span className="assignment-card__difficulty">
                    {item.difficulty}
                  </span>
                  <span className="assignment-card__action">
                    {isCompleted ? 'View Solution' : 'Solve Challenge'}
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;