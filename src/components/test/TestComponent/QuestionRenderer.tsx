import React from 'react';
import { View, Text } from 'react-native';
import MCQQuestion from '../QuestionTypes/MCQQuestion';
import FillBlankQuestion from '../QuestionTypes/FillBlankQuestion';
import TFQuestion from '../QuestionTypes/TFQuestion';
import MatchingQuestion from '../QuestionTypes/MatchingQuestion';
import TableComQuestion from '../QuestionTypes/TableComQuestion';
import SelectingFactorsQuestion from '../QuestionTypes/SelectingFactorsQuestion';
import MatchingCauseEffectQuestion from '../QuestionTypes/MatchingCauseEffectQuestion';

export default function QuestionRenderer({
  question,
  type,
  value,
  onChange,
  extra,
  isReview = false
}: any) {
  
  const renderQuestion = () => {
    switch (type) {
      case 'multiple_choice':
        return <MCQQuestion question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />;
      
      case 'summary_completion':
      case 'form_completion':
      case 'note_completion':
      case 'sentence_completion':
      case 'short_answer':
        return <FillBlankQuestion question={question} value={value} onChange={onChange} isReview={isReview} />;
      
      case 'yes_no_not_given':
      case 'true_false_not_given':
        return <TFQuestion question={question} value={value} onChange={onChange} type={type} isReview={isReview} />;
      
      case 'matching_features':
      case 'matching':
        return (
          <MatchingQuestion
            question={question}
            options={extra?.options || []}
            value={value}
            onChange={onChange}
            isReview={isReview}
          />
        );
      
      case 'table_completion':
        return (
          <TableComQuestion
            question={question}
            value={value}
            onChange={onChange}
            isReview={isReview}
          />
        );
      
      case 'selecting_factors':
        return (
          <SelectingFactorsQuestion
            question={question}
            options={extra?.options || []}
            value={value}
            onChange={onChange}
            isReview={isReview}
          />
        );
      
      case 'matching_cause_effect':
        return (
          <MatchingCauseEffectQuestion
            question={question}
            effects={extra?.effects || []}
            value={value}
            onChange={onChange}
            isReview={isReview}
          />
        );
        
      default:
        return (
          <View style={{ padding: 16, backgroundColor: '#fef2f2', borderRadius: 8, marginBottom: 20 }}>
            <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 12 }}>
              Unsupported question type: {type}
            </Text>
          </View>
        );
    }
  };

  return <View>{renderQuestion()}</View>;
}
