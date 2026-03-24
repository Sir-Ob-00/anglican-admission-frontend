import React, { useState } from "react";

export default function CreateExam() {
  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    duration: "",
    instructions: "",
    status: "draft",
    questions: [],
  });

  const [classId, setClassId] = useState("");
  const [examId, setExamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setExamData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
          marks: 0,
          type: "mcq",
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...examData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setExamData({ ...examData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...examData.questions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[oIndex] = value;
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    setExamData({ ...examData, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData({ ...examData, questions: newQuestions });
  };

  const saveExam = async (status) => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = { ...examData, status };
      const response = await fetch("/api/v1/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aas_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to save exam");

      setExamData((prev) => ({ ...prev, status }));
      if (result.exam?._id || result.exam?.id) {
        setExamId(result.exam._id || result.exam.id);
      }
      
      setMessage({
        text: `Exam successfully ${status === "draft" ? "saved as draft" : "published"}!`,
        type: "success",
      });
    } catch (error) {
      console.error("Save Exam Error:", error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const assignExam = async () => {
    if (!examId || !classId) {
      setMessage({ text: "Please ensure Exam ID is generated and Class ID is provided.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const response = await fetch(`/api/v1/exams/${examId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aas_token") || ""}`,
        },
        body: JSON.stringify({ class_id: classId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to assign exam");

      setMessage({ text: "Exam successfully assigned to class!", type: "success" });
    } catch (error) {
      console.error("Assign Exam Error:", error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Exam</h1>
          <p className="mt-1 text-sm text-slate-500">Author and publish examinations for your classes.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => saveExam("draft")}
            disabled={loading}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => saveExam("published")}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Publish Exam
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details & Assignment */}
        <div className="space-y-6 md:col-span-1">
          {/* Section 1: Exam Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Exam Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Mid-Term Mathematics"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={examData.subject}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Instructions</label>
                <textarea
                  name="instructions"
                  value={examData.instructions}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Attempt all questions..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 4: Assign Exam */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Assign Exam</h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-medium text-slate-700">Exam ID</label>
                <input
                  type="text"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  readOnly={true}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 outline-none"
                  placeholder="Auto-filled on publish"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Class ID</label>
                <input
                  type="text"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Class ID"
                />
              </div>
              <button
                onClick={assignExam}
                disabled={loading || !examId}
                className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Assign Exam
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Questions */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Questions ({examData.questions.length})</h2>
            <button
              onClick={addQuestion}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              + Add Question
            </button>
          </div>

          {examData.questions.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              No questions added yet. Click "+ Add Question" to begin.
            </div>
          ) : (
            examData.questions.map((q, qIndex) => (
              <div key={qIndex} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute right-4 top-4 text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Question {qIndex + 1}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500 focus:bg-white"
                      placeholder="Enter question text..."
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <span className="font-medium text-slate-500">{String.fromCharCode(65 + oIndex)}.</span>
                        <input
                          type="text"
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          value={opt}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Correct Answer</label>
                      <select
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={q.answer}
                        onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
                      >
                        <option value="">Select answer...</option>
                        {q.options.map((opt, idx) => (
                          <option key={idx} value={opt} disabled={!opt}>
                            {String.fromCharCode(65 + idx)}: {opt.substring(0, 20)}
                            {opt.length > 20 ? "..." : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Marks</label>
                      <input
                        type="number"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={q.marks}
                        onChange={(e) => updateQuestion(qIndex, "marks", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
