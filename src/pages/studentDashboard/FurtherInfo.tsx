import React, { useEffect, useState } from 'react';
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import { fetchEligibilityQuestions } from "../../services/GrantProgramService";
import { renderInput } from "../../utility/QuestionInput";
import type { QuestionEligibilityInfoDto } from "../../data/questionEligibilityInfoDto";

interface AnswerState {
  answer: any;
  submitted: boolean;
}

const FurtherInfo: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const [chosenQuestions, setChosenQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [loading, setLoading] = useState(false);
  const [allSubmitted, setAllSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEligibilityQuestions()
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []);

  const handleQuestionClick = (q: QuestionEligibilityInfoDto) => {
    if (!chosenQuestions.some(cq => cq.question.id === q.question.id)) {
      setChosenQuestions(prev => [...prev, q]);
      setAnswers(prev => ({ ...prev, [q.question.id!]: { answer: "", submitted: false } }));
    }
  };

  const handleInputChange = (id: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], answer: value }
    }));
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all as submitted
    setAnswers(prev => {
      const updated: Record<string, AnswerState> = { ...prev };
      chosenQuestions.forEach(q => {
        if (updated[q.question.id!]) {
          updated[q.question.id!] = { ...updated[q.question.id!], submitted: true };
        }
      });
      return updated;
    });
    setAllSubmitted(true);
    // Here you would send all answers to the backend
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Further Information"
        headline="Answer to the frequently asked core questions for most grant programs"
        student={true}
      />
      <div className="form-group eligibility-lists">
        {loading && <p>Loading questions...</p>}
        {!loading && questions.map((q) => {
          const alreadyChosen = chosenQuestions.some(cq => cq.question.id === q.question.id);
          return (
            <Button
              key={q.question.id}
              text={q.question.name}
              onClick={() => handleQuestionClick(q)}
              type="button"
              variant={alreadyChosen ? "primary" : "outline"}
              disabled={alreadyChosen}
            />
          );
        })}
      </div>
      {chosenQuestions.length > 0 && (
        <form className="eligibility-forms" onSubmit={handleSubmitAll}>
          {chosenQuestions.map((q) => (
            <div className="form-group" key={q.question.id} style={{ marginTop: 24 }}>
              {renderInput(q.question, q.options, answers[q.question.id!]?.answer, handleInputChange)}
              {answers[q.question.id!]?.submitted && (
                <div className="success-message">Your answer has been submitted!</div>
              )}
            </div>
          ))}
          <div className="message-send-btn-wrapper">
            <Button
              text={allSubmitted ? "Submitted" : "Submit"}
              type="submit"
              variant="primary"
              disabled={allSubmitted}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default FurtherInfo;