import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { Input, Textarea, Select } from "../common/Input";
import { Button } from "../common/Button";
import { useApp } from "../../context/AppContext";

export function ActivityFormModal({ isOpen, onClose, initialData = null }) {
  const { addActivity, updateActivity } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    category: "ACADEMIC",
    date: new Date().toISOString().split("T")[0],
    startTime: new Date().toTimeString().slice(0, 5),
    duration: 30,
    notes: "",
    tags: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || initialData.activity?.name || "",
        category: initialData.category || initialData.activity?.category || "ACADEMIC",
        date: initialData.date ? initialData.date.split("T")[0] : new Date().toISOString().split("T")[0],
        startTime: initialData.startTime || "10:00",
        duration: initialData.duration || 30,
        notes: initialData.notes || "",
        tags: initialData.tags ? initialData.tags.join(", ") : "",
        amount: initialData.amount || "",
      });
    } else {
      setFormData({
        title: "",
        category: "ACADEMIC",
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toTimeString().slice(0, 5),
        duration: 30,
        notes: "",
        tags: "",
        amount: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter an activity title.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tagString = formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean).join(", ") : "";
      const noteText = [formData.notes.trim(), tagString ? `Tags: ${tagString}` : ""].filter(Boolean).join(" | ");

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        duration: Number(formData.duration) || 0,
        note: noteText || null,
      };

      if (initialData?.id) {
        await updateActivity(initialData.id, payload);
      } else {
        await addActivity(payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Activity" : "Log New Activity"}
      subtitle="Record your daily habits, study time, or wellness accomplishments."
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
        {error && (
          <div
            style={{
              padding: "var(--dm-space-3)",
              backgroundColor: "var(--dm-danger-soft)",
              color: "var(--dm-danger)",
              borderRadius: "var(--dm-radius-sm)",
              fontSize: "var(--dm-text-xs)",
            }}
          >
            {error}
          </div>
        )}

        <Input
          label="Activity Name"
          placeholder="e.g. Data Structures Study, Morning Run, Hydration"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="ACADEMIC">Academic</option>
            <option value="HEALTH">Health & Fitness</option>
            <option value="PERSONAL">Personal Habit</option>
            <option value="SOCIAL">Social & Community</option>
            <option value="WORK">Work / Projects</option>
            <option value="OTHER">Other</option>
          </Select>

          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            max="1440"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <Input
            label="Start Time"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>

        <Input
          label="Tags (optional, comma-separated)"
          placeholder="e.g. ExamPrep, Cardio, Morning"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        <Textarea
          label="Notes / Reflection"
          placeholder="Add any thoughts, key achievements, or notes..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--dm-space-2)", marginTop: "var(--dm-space-2)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            {initialData ? "Update Activity" : "Log Activity"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ActivityFormModal;
