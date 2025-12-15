// components/feedback-modal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StorageService, type Feedback } from "../utils/storage";

interface FeedbackModalProps {
  visible: boolean;
  visitId: string | null;
  onClose: () => void;
  onSubmit?: () => void;
}

export function FeedbackModal({
  visible,
  visitId,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  // Multiple-choice answers for each question
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Questions shown to the patient
  const questions = [
    {
      id: "staff",
      text: "How was the staff?",
      options: ["Excellent", "Good", "Okay", "Poor"],
    },
    {
      id: "waitTime",
      text: "How was the wait time?",
      options: ["Very fast", "Reasonable", "Slow", "Very slow"],
    },
    {
      id: "care",
      text: "How was the care you received?",
      options: ["Excellent", "Good", "Fair", "Poor"],
    },
  ];

  const selectAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const isComplete = questions.every((q) => answers[q.id]);

  const computeOverallRating = (answersMap: Record<string, string>): number => {
    // Map text answers to numeric scores (1–4)
    const scoreMap: Record<string, number> = {
      Excellent: 4,
      "Very fast": 4,
      Good: 3,
      Reasonable: 3,
      Okay: 2,
      Fair: 2,
      Slow: 2,
      Poor: 1,
      "Very slow": 1,
    };

    const scores = Object.values(answersMap)
      .map((a) => scoreMap[a])
      .filter((s): s is number => typeof s === "number");

    if (scores.length === 0) return 0;

    const sum = scores.reduce((total, n) => total + n, 0);
    return Math.round(sum / scores.length);
  };

  const handleSubmit = async () => {
    if (!visitId || !isComplete) return;

    setSubmitting(true);
    try {
      const overallRating = computeOverallRating(answers);

      // Build a summary string of the answers + optional extra comment
      const answersSummary = questions
        .map((q) => `${q.text} ${answers[q.id]}`)
        .join("\n");

      const fullComment = comment
        ? `${answersSummary}\n\nAdditional comments:\n${comment}`
        : answersSummary;

      const feedback: Feedback = {
        rating: overallRating,
        comment: fullComment,
        timestamp: Date.now(),
      };

      await StorageService.addFeedbackToVisit(visitId, feedback);

      // Reset and close
      setAnswers({});
      setComment("");
      onSubmit?.();
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnswers({});
    setComment("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>How was your visit?</Text>
              <Text style={styles.subtitle}>
                Answer a few quick questions to help us improve
              </Text>

              {questions.map((q) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionText}>{q.text}</Text>

                  {q.options.map((option) => {
                    const selected = answers[q.id] === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => selectAnswer(q.id, option)}
                        style={[
                          styles.optionButton,
                          selected && styles.optionButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selected && styles.optionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              <View style={styles.commentContainer}>
                <Text style={styles.commentLabel}>
                  Anything else you'd like to share? (optional)
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience..."
                  placeholderTextColor="#7a8fb3"
                  multiline
                  numberOfLines={4}
                  style={styles.commentInput}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={[styles.button, styles.cancelButton]}
                  disabled={submitting}
                >
                  <Text style={styles.cancelButtonText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[
                    styles.button,
                    styles.submitButton,
                    (!isComplete || submitting) && styles.submitButtonDisabled,
                  ]}
                  disabled={!isComplete || submitting}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#1e3a8a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#93c5fd",
    marginBottom: 24,
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.3)",
    marginBottom: 8,
    backgroundColor: "rgba(30, 64, 175, 0.8)",
  },
  optionButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#60a5fa",
  },
  optionText: {
    color: "white",
    fontSize: 15,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: "white",
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: "rgba(30, 58, 138, 0.5)",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderWidth: 1.5,
    borderColor: "#60a5fa",
  },
  cancelButtonText: {
    color: "#93c5fd",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#3b9eff",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(96, 165, 250, 0.3)",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
