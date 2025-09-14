// Unit Tests for Disease Symptoms Education Routes
// File: features/disease-symptoms/tests/diseaseRoutes.test.js

const request = require('supertest');
const express = require('express');
const diseaseRoutes = require('../routes/diseaseRoutes');

// Mock dependencies
jest.mock('../../../config/database', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          limit: jest.fn(),
          order: jest.fn()
        })),
        in: jest.fn(() => ({
          select: jest.fn()
        })),
        insert: jest.fn(),
        update: jest.fn(() => ({
          eq: jest.fn()
        })),
        or: jest.fn(),
        ilike: jest.fn(() => ({
          limit: jest.fn()
        })),
        gte: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn()
          }))
        })),
        lte: jest.fn(() => ({
          gte: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn()
            }))
          }))
        }))
      }))
    }))
  }
}));

jest.mock('../../../utils/aiUtils', () => ({
  detectLanguage: jest.fn(() => 'en'),
  getGeminiResponse: jest.fn(() => 'This is for awareness only. Please consult a doctor for proper diagnosis.')
}));

const app = express();
app.use(express.json());
app.use('/api/diseases', diseaseRoutes);

describe('Disease Routes', () => {
  
  describe('GET /api/diseases', () => {
    it('should return list of diseases', async () => {
      const mockDiseases = [
        {
          id: 1,
          name: 'Common Cold',
          name_hi: 'सामान्य सर्दी',
          description: 'Viral infection affecting nose and throat',
          severity_level: 'low',
          is_contagious: true
        }
      ];

      const { supabase } = require('../../../config/database');
      supabase.from().select().limit.mockResolvedValue({
        data: mockDiseases,
        error: null
      });

      const response = await request(app)
        .get('/api/diseases')
        .query({ language: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Common Cold');
    });

    it('should filter diseases by category', async () => {
      const { supabase } = require('../../../config/database');
      supabase.from().select().eq().limit.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/diseases')
        .query({ category: 1, language: 'en' });

      expect(response.status).toBe(200);
      expect(supabase.from().select().eq).toHaveBeenCalledWith('disease_category_mapping.category_id', 1);
    });

    it('should handle database errors', async () => {
      const { supabase } = require('../../../config/database');
      supabase.from().select().limit.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      const response = await request(app)
        .get('/api/diseases');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to fetch diseases');
    });
  });

  describe('GET /api/diseases/:id', () => {
    it('should return disease details', async () => {
      const mockDisease = {
        id: 1,
        name: 'Dengue Fever',
        name_hi: 'डेंगू बुखार',
        description: 'Mosquito-borne viral infection',
        severity_level: 'high',
        disease_symptoms: [
          {
            frequency: 'common',
            severity: 'severe',
            symptoms: {
              id: 1,
              name: 'Fever',
              body_part: 'head',
              severity_indicator: 'moderate'
            }
          }
        ],
        awareness_campaigns: []
      };

      const { supabase } = require('../../../config/database');
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockDisease,
        error: null
      });

      const response = await request(app)
        .get('/api/diseases/1')
        .query({ language: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Dengue Fever');
      expect(response.body.data.symptoms).toHaveLength(1);
    });

    it('should return 404 for non-existent disease', async () => {
      const { supabase } = require('../../../config/database');
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null
      });

      const response = await request(app)
        .get('/api/diseases/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Disease not found');
    });
  });

  describe('POST /api/diseases/symptom-checker', () => {
    it('should analyze symptoms and return suggestions', async () => {
      const mockSymptoms = [
        { id: 1, name: 'Fever', severity_indicator: 'moderate' }
      ];
      
      const mockDiseases = [
        {
          disease_id: 1,
          frequency: 'common',
          severity: 'severe',
          diseases: {
            id: 1,
            name: 'Dengue Fever',
            severity_level: 'high',
            when_to_seek_help: 'Seek immediate medical help'
          }
        }
      ];

      const { supabase } = require('../../../config/database');
      
      // Mock emergency keywords check
      supabase.from().select().eq.mockResolvedValueOnce({
        data: [],
        error: null
      });
      
      // Mock symptoms search
      supabase.from().select().or.mockResolvedValueOnce({
        data: mockSymptoms,
        error: null
      });
      
      // Mock disease search
      supabase.from().select().in.mockResolvedValueOnce({
        data: mockDiseases,
        error: null
      });

      const response = await request(app)
        .post('/api/diseases/symptom-checker')
        .send({
          symptoms: ['fever', 'headache'],
          language: 'en'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.emergency).toBe(false);
      expect(response.body.data.suggested_diseases).toHaveLength(1);
    });

    it('should trigger emergency response for critical keywords', async () => {
      const mockEmergencyKeywords = [
        {
          keyword: 'chest pain',
          severity_level: 'emergency',
          auto_response: '🚨 EMERGENCY: Call 108 immediately!'
        }
      ];

      const { supabase } = require('../../../config/database');
      supabase.from().select().eq.mockResolvedValue({
        data: mockEmergencyKeywords,
        error: null
      });

      const response = await request(app)
        .post('/api/diseases/symptom-checker')
        .send({
          symptoms: ['severe chest pain'],
          language: 'en'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.emergency).toBe(true);
      expect(response.body.message).toContain('🚨 EMERGENCY');
    });

    it('should validate input parameters', async () => {
      const response = await request(app)
        .post('/api/diseases/symptom-checker')
        .send({
          symptoms: []
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Please provide symptoms array');
    });

    it('should handle AI response errors gracefully', async () => {
      const { getGeminiResponse } = require('../../../utils/aiUtils');
      getGeminiResponse.mockRejectedValue(new Error('AI service unavailable'));

      const { supabase } = require('../../../config/database');
      supabase.from().select().eq.mockResolvedValue({ data: [], error: null });
      supabase.from().select().or.mockResolvedValue({ data: [], error: null });
      supabase.from().select().in.mockResolvedValue({ data: [], error: null });

      const response = await request(app)
        .post('/api/diseases/symptom-checker')
        .send({
          symptoms: ['fever'],
          language: 'en'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/diseases/categories/list', () => {
    it('should return disease categories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Infectious Diseases',
          name_hi: 'संक्रामक रोग',
          description: 'Diseases that spread from person to person',
          icon: 'virus'
        }
      ];

      const { supabase } = require('../../../config/database');
      supabase.from().select().order.mockResolvedValue({
        data: mockCategories,
        error: null
      });

      const response = await request(app)
        .get('/api/diseases/categories/list')
        .query({ language: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Infectious Diseases');
    });
  });

  describe('GET /api/diseases/campaigns/active', () => {
    it('should return active awareness campaigns', async () => {
      const mockCampaigns = [
        {
          id: 1,
          title: 'Dengue Prevention',
          title_hi: 'डेंगू रोकथाम',
          content: 'Remove stagnant water to prevent dengue',
          campaign_type: 'prevention',
          media_type: 'text'
        }
      ];

      const { supabase } = require('../../../config/database');
      supabase.from().select().eq().gte().order().limit.mockResolvedValue({
        data: mockCampaigns,
        error: null
      });

      const response = await request(app)
        .get('/api/diseases/campaigns/active')
        .query({ language: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Dengue Prevention');
    });
  });

  describe('POST /api/diseases/feedback', () => {
    it('should record user feedback', async () => {
      const { supabase } = require('../../../config/database');
      supabase.from().update().eq.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .post('/api/diseases/feedback')
        .send({
          query_id: 1,
          feedback: 'helpful',
          patient_id: 123
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Feedback recorded successfully');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/diseases/feedback')
        .send({
          query_id: 1
          // missing feedback
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Query ID and feedback are required');
    });
  });
});

// Integration test with actual database (optional)
describe('Disease Routes Integration', () => {
  // These tests would run against a test database
  // Skip if no test database is configured
  
  it.skip('should perform end-to-end symptom checking', async () => {
    // This would test the full flow with real database
    const response = await request(app)
      .post('/api/diseases/symptom-checker')
      .send({
        symptoms: ['fever', 'headache', 'body pain'],
        patient_id: 1,
        language: 'en'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.suggested_diseases.length).toBeGreaterThan(0);
  });
});
