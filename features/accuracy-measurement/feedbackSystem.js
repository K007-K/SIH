// Accuracy measurement and feedback collection system

// Feedback categories and rating system
const feedbackCategories = {
  accuracy: {
    name: 'Response Accuracy',
    description: 'How accurate was the health information provided?',
    scale: 5
  },
  helpfulness: {
    name: 'Helpfulness',
    description: 'How helpful was the response to your health query?',
    scale: 5
  },
  clarity: {
    name: 'Clarity',
    description: 'How clear and understandable was the response?',
    scale: 5
  },
  completeness: {
    name: 'Completeness',
    description: 'Did the response address all aspects of your query?',
    scale: 5
  }
};

// Generate feedback collection buttons
const generateFeedbackButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '⭐ Rate Our Response'
      },
      body: {
        text: 'Your feedback helps us improve healthcare assistance:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'feedback_excellent',
              title: '⭐⭐⭐⭐⭐ Excellent'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback_good',
              title: '⭐⭐⭐⭐ Good'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback_average',
              title: '⭐⭐⭐ Average'
            }
          }
        ]
      }
    }
  };
};

// Generate detailed feedback buttons
const generateDetailedFeedbackButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '📊 Detailed Feedback'
      },
      body: {
        text: 'Help us understand specific areas:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'feedback_accuracy',
              title: '🎯 Rate Accuracy'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback_helpfulness',
              title: '🤝 Rate Helpfulness'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback_clarity',
              title: '💡 Rate Clarity'
            }
          }
        ]
      }
    }
  };
};

// Generate improvement suggestion buttons
const generateImprovementButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '💡 Suggest Improvements'
      },
      body: {
        text: 'What could we improve?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'improve_accuracy',
              title: '🎯 More Accurate Info'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'improve_speed',
              title: '⚡ Faster Response'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'improve_features',
              title: '✨ New Features'
            }
          }
        ]
      }
    }
  };
};

// Generate issue reporting buttons
const generateIssueReportButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🐛 Report an Issue'
      },
      body: {
        text: 'What type of issue did you encounter?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'issue_incorrect_info',
              title: '❌ Incorrect Information'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'issue_technical',
              title: '⚙️ Technical Problem'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'issue_other',
              title: '❓ Other Issue'
            }
          }
        ]
      }
    }
  };
};

// Process feedback submission
const processFeedback = async (feedbackType, rating, userId, messageId, additionalComments = '') => {
  const timestamp = new Date().toISOString();
  
  const feedbackData = {
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId,
    messageId: messageId,
    type: feedbackType,
    rating: rating,
    timestamp: timestamp,
    comments: additionalComments,
    category: determineFeedbackCategory(feedbackType)
  };
  
  // In production, this would save to database
  console.log('Feedback received:', feedbackData);
  
  // Calculate accuracy metrics
  const accuracyMetrics = await calculateAccuracyMetrics(feedbackData);
  
  return {
    success: true,
    message: generateFeedbackThankYou(rating),
    metrics: accuracyMetrics
  };
};

// Determine feedback category
const determineFeedbackCategory = (feedbackType) => {
  if (feedbackType.includes('accuracy')) return 'accuracy';
  if (feedbackType.includes('helpfulness')) return 'helpfulness';
  if (feedbackType.includes('clarity')) return 'clarity';
  if (feedbackType.includes('completeness')) return 'completeness';
  return 'general';
};

// Calculate accuracy metrics
const calculateAccuracyMetrics = async (feedbackData) => {
  // Mock calculation - in production, this would query the database
  const mockMetrics = {
    overallAccuracy: 82.5, // Target: 80%
    totalResponses: 1247,
    positiveRatings: 1029,
    averageRating: 4.1,
    accuracyTrend: '+2.3%', // Improvement over last week
    categoryBreakdown: {
      accuracy: 4.2,
      helpfulness: 4.0,
      clarity: 4.1,
      completeness: 3.9
    }
  };
  
  return mockMetrics;
};

// Generate thank you message based on rating
const generateFeedbackThankYou = (rating) => {
  const ratingNum = parseInt(rating) || 3;
  
  if (ratingNum >= 4) {
    return "🙏 Thank you for the positive feedback! We're glad we could help with your healthcare query.";
  } else if (ratingNum === 3) {
    return "🙏 Thank you for your feedback! We're working to improve our healthcare assistance.";
  } else {
    return "🙏 Thank you for your honest feedback. We'll use this to improve our healthcare service quality.";
  }
};

// Generate accuracy dashboard for admins
const generateAccuracyDashboard = (metrics) => {
  let dashboard = `📊 **Healthcare Bot Accuracy Dashboard**\n\n`;
  dashboard += `🎯 **Overall Accuracy:** ${metrics.overallAccuracy}% (Target: 80%)\n`;
  dashboard += `📈 **Trend:** ${metrics.accuracyTrend}\n`;
  dashboard += `📝 **Total Responses:** ${metrics.totalResponses}\n`;
  dashboard += `👍 **Positive Ratings:** ${metrics.positiveRatings}\n`;
  dashboard += `⭐ **Average Rating:** ${metrics.averageRating}/5\n\n`;
  
  dashboard += `**Category Breakdown:**\n`;
  Object.entries(metrics.categoryBreakdown).forEach(([category, score]) => {
    dashboard += `• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${score}/5\n`;
  });
  
  dashboard += `\n*Dashboard updated in real-time based on user feedback.*`;
  return dashboard;
};

// Generate user satisfaction survey
const generateSatisfactionSurvey = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '📋 Quick Health Service Survey'
      },
      body: {
        text: 'Help us measure our impact (takes 30 seconds):'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'survey_start',
              title: '📝 Start Survey'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'survey_later',
              title: '⏰ Remind Me Later'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'survey_skip',
              title: '⏭️ Skip Survey'
            }
          }
        ]
      }
    }
  };
};

// Process survey responses for awareness measurement
const processSurveyResponse = (questionId, response, userId) => {
  const surveyData = {
    id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId,
    questionId: questionId,
    response: response,
    timestamp: new Date().toISOString()
  };
  
  // In production, save to database for awareness analytics
  console.log('Survey response:', surveyData);
  
  return {
    success: true,
    nextQuestion: getNextSurveyQuestion(questionId),
    progress: calculateSurveyProgress(questionId)
  };
};

// Get next survey question
const getNextSurveyQuestion = (currentQuestionId) => {
  const surveyQuestions = {
    'q1_awareness': 'How would you rate your health awareness before using this service?',
    'q2_knowledge': 'Did you learn something new about health today?',
    'q3_behavior': 'Will you change any health behaviors based on our advice?',
    'q4_recommendation': 'Would you recommend this service to others?',
    'q5_satisfaction': 'Overall, how satisfied are you with the service?'
  };
  
  const questionOrder = Object.keys(surveyQuestions);
  const currentIndex = questionOrder.indexOf(currentQuestionId);
  
  if (currentIndex < questionOrder.length - 1) {
    const nextQuestionId = questionOrder[currentIndex + 1];
    return {
      id: nextQuestionId,
      question: surveyQuestions[nextQuestionId]
    };
  }
  
  return null; // Survey complete
};

// Calculate survey progress
const calculateSurveyProgress = (currentQuestionId) => {
  const totalQuestions = 5;
  const questionOrder = ['q1_awareness', 'q2_knowledge', 'q3_behavior', 'q4_recommendation', 'q5_satisfaction'];
  const currentIndex = questionOrder.indexOf(currentQuestionId);
  
  return {
    current: currentIndex + 1,
    total: totalQuestions,
    percentage: Math.round(((currentIndex + 1) / totalQuestions) * 100)
  };
};

module.exports = {
  feedbackCategories,
  generateFeedbackButtons,
  generateDetailedFeedbackButtons,
  generateImprovementButtons,
  generateIssueReportButtons,
  processFeedback,
  calculateAccuracyMetrics,
  generateAccuracyDashboard,
  generateSatisfactionSurvey,
  processSurveyResponse,
  getNextSurveyQuestion
};
