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
;


