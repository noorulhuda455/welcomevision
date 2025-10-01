import React, { useState } from "react";

function FeedbackPrompt () {
  const [showPrompt, setShowPrompt] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feeback.trim()) {
      // TODO: send feedback to backend here
      console.log("User Feedback: ", feedback);
      setSubmitted(true);
      setShowPrompt(false);
    } else {
      alert("Please enter some feedback before submitting. ");
    }
  };

if (!showPrompt) return null;

return (
  <div style={styles.overlay)>
    <div style={styles.card}>
      {!submitted ? (
        <>
          <h2>We'd love your thoughts
          <p>Your feedback helps us improve your eye care experience. </p>

          <textarea
            style={styles.textarea}
            placeholder="Type your feedback here!"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div style={styles.buttonRow}>
            <button style={styles.primaryBtn} onClick={handleSubmit}>
                Submit Feeback
            </button>
            <button 
              style={styles.secondaryBtn}
              onClick={() => setShowPrompt(false)}
          >
            Remind Me Later
          </button>
          <button
            style={styles.skipBtn}
            onClick={() => setShowPrompt(false)}
          >
            Skip
          </button>
        </div>
      </>
  ) : (
    <h3>Thank you for your feeback!</h3>
  )}
  </div>
</div>
);
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0; left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  textarea: {
    width: "100%",
    height: "100px",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontsize: "14px",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  primaryBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none"
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "#f0ad4e",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  skipBtn: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default FeedbackPrompt;


