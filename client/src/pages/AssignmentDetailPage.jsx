import { executeQuery } from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../services/api";
import { getSampleData } from "../services/api";
import { getHint } from "../services/api";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [sampleData, setSampleData] = useState(null);
const [hint, setHint] = useState(null);
const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    getAssignmentById(id)
      .then((res) => {
        setAssignment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
      getSampleData(id)
      .then((res) => {
        setSampleData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!assignment) return <p>Assignment not found</p>;
 const handleExecute = async () => {
  if (executing) return;   

  if (!query.trim()) {
    setError("Query cannot be empty.");
    return;
  }

  setExecuting(true);
  setError(null);
  setResult(null);

  try {
    const res = await executeQuery(query);
    setResult(res.data);
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Something went wrong while executing query.";
    setError(message);
  } finally {
    setExecuting(false);  
  }
};
  return (
  <div className="detail">
    <div className="detail__container">

      {/* LEFT SIDE */}
      <div className="detail__left">
        <h1>{assignment.title}</h1>
        <p>{assignment.description}</p>
        <span className="detail__difficulty">
          {assignment.difficulty}
        </span>
      </div>





      
      {sampleData && (
  <div className="detail__sample">
    <h3>Table Schema</h3>

    <ul>
      {sampleData.schema.map((col, index) => (
        <li key={index}>
          {col.column} ({col.type})
        </li>
      ))}
    </ul>

    <h3>Sample Data</h3>

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
              <td key={i}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* RIGHT SIDE */}
    <div className="detail__right">

  <textarea
    value={query}
    onChange={(e) => {
      setQuery(e.target.value);
      setError(null);
    }}
  />

  {error && (
    <div className="detail__error">
      {error}
    </div>
  )}

  {/* Execute Button */}
  <button
    disabled={executing}
    onClick={handleExecute}
  >
    {executing ? "Running..." : "Execute Query"}
  </button>

  {/* Hint Button */}
  <button
    disabled={loadingHint}
    onClick={() => {
      setLoadingHint(true);

      getHint(id, assignment.description)
        .then((res) => {
          setHint(res.data.hint);
        })
        .finally(() => {
          setLoadingHint(false);
        });
    }}
  >
    {loadingHint ? "Getting Hint..." : "Get Hint"}
  </button>

  {hint && (
    <div className="detail__hint">
      {hint}
    </div>
  )}

  {result && result.rows && (
    <div className="detail__result">
      <h3>Result:</h3>

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
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total Rows: {result.rowCount}</p>
    </div>
  )}

</div>

    </div>
  </div>
);
};

export default AssignmentDetailPage;