import { getActiveQuestions } from '@/lib/actions/surveys';
import SurveyForm from './survey-form';

export const revalidate = 0;

export default async function SurveyPage() {
  const result = await getActiveQuestions();
  const questions = result.success ? result.data : [];

  return <SurveyForm questions={questions} />;
}