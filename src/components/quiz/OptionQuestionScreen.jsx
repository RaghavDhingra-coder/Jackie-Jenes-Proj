import { OptionCard } from '../DesignSystem.jsx';
import QuizScreenLayout from './QuizScreenLayout.jsx';

function OptionQuestionScreen({
  questionNumber,
  totalQuestions,
  progress,
  onBack,
  headline,
  subtext,
  options,
  value,
  onSelect,
}) {
  return (
    <QuizScreenLayout
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      progress={progress}
      onBack={onBack}
      headline={headline}
      subtext={subtext}
    >
      <div>
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.title}
            subtitle={opt.subtitle}
            selected={value === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default OptionQuestionScreen;
