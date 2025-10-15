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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!visitId || rating === 0) return;

    setSubmitting(true);
    try {
      const feedback: Feedback = {
        rating,
        comment,
        timestamp: Date.now(),
      };

      await StorageService.addFeedbackToVisit(visitId, feedback);

      // Reset and close
      setRating(0);
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
    setRating(0);
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
                Your feedback helps us improve our service
              </Text>

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rate your experience</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starButton}
                    >
                      <Text
                        style={[
                          styles.star,
                          star <= rating && styles.starFilled,
                        ]}
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.commentContainer}>
                <Text style={styles.commentLabel}>
                  Tell us more (optional)
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience..."
                  placeholderTextColor="#99a"
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
                    (rating === 0 || submitting) && styles.submitButtonDisabled,
                  ]}
                  disabled={rating === 0 || submitting}
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
    backgroundColor: "#1a2035",
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
    color: "#bcd",
    marginBottom: 24,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 40,
    color: "#3a4560",
  },
  starFilled: {
    color: "#ffd700",
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
    backgroundColor: "#0b1220",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
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
    backgroundColor: "#2a3550",
  },
  cancelButtonText: {
    color: "#bcd",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4c6fff",
  },
  submitButtonDisabled: {
    backgroundColor: "#3a4560",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
