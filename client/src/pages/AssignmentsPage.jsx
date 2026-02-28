import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignments } from "../services/api";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="assignments">
      <h1 className="assignments__title">SQL Assignments</h1>

      <div className="assignments__list">
        {assignments.map((item) => (
          <Link
  to={`/assignment/${item.id}`}
  key={item.id}
  className="assignment-card"
>
            <h3 className="assignment-card__title">
              {item.title}
            </h3>
            <p className="assignment-card__description">
              {item.description}
            </p>
            <span className="assignment-card__difficulty">
              {item.difficulty}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;