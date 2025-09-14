# Disease Symptoms Education Feature

## Overview
A comprehensive multilingual disease symptoms education system for rural and semi-urban WhatsApp users. Provides non-diagnostic symptom checking, disease awareness, and emergency response capabilities.

## Features
- **Non-diagnostic symptom checker** with confidence scoring
- **Emergency keyword detection** with immediate response
- **Multilingual support** for 15+ Indian languages
- **Disease information database** with prevention tips
- **Awareness campaigns** management
- **Safety guardrails** and rate limiting
- **WhatsApp integration** with templates

## Architecture

```
features/disease-symptoms/
├── migrations/           # Database schema and migrations
├── routes/              # Express.js API routes
├── services/            # Business logic layer
├── utils/               # Safety guards and utilities
├── whatsapp/            # WhatsApp templates and formatting
├── integration/         # WhatsApp integration layer
├── tests/               # Unit tests
└── seed-data/           # Sample data for testing
```

## Database Schema

### Core Tables
- `diseases` - Disease master data with multilingual support
- `symptoms` - Symptom definitions and translations
- `disease_symptoms` - Many-to-many relationship with frequency/severity
- `disease_categories` - Categorization for better organization
- `awareness_campaigns` - Educational content management
- `emergency_keywords` - Critical keywords for emergency detection
- `symptom_queries` - Analytics and user query logging

### Safety Tables
- `safety_events` - Emergency trigger logging
- `migration_history` - Database migration tracking

## API Endpoints

### Disease Information
- `GET /api/diseases` - List diseases with filtering
- `GET /api/diseases/:id` - Get disease details
- `GET /api/diseases/categories/list` - Get disease categories

### Symptom Checker
- `POST /api/diseases/symptom-checker` - Analyze symptoms (non-diagnostic)
- `POST /api/diseases/feedback` - Record user feedback

### Awareness Campaigns
- `GET /api/diseases/campaigns/active` - Get active campaigns

## Safety Features

### Emergency Detection
- **Critical keywords** trigger immediate 108 call instructions
- **High-risk symptoms** prompt urgent medical attention
- **Automatic logging** of all safety events
- **Rate limiting** to prevent abuse

### Safety Guardrails
- All responses include medical disclaimer
- Maximum 10 symptoms per query
- Input validation and sanitization
- Inappropriate content filtering

## WhatsApp Integration

### Message Routing
Disease-related queries are automatically detected and routed to the Disease Education feature based on keywords:
- English: symptom, disease, fever, pain
- Hindi: लक्षण, रोग
- Telugu: లక్షణం, వ్యాధి
- Tamil: அறிகுறி, நோய்

### Response Templates
- Emergency alerts with immediate action instructions
- Symptom analysis results with confidence scores
- Disease information with prevention tips
- Prevention guidance and health tips

## Installation & Setup

### 1. Run Database Migrations
```bash
cd features/disease-symptoms/migrations
node run_migrations.js run
```

### 2. Check Migration Status
```bash
node run_migrations.js status
```

### 3. Install Dependencies
The feature uses existing project dependencies:
- express
- @supabase/supabase-js
- axios

### 4. Environment Variables
Required environment variables are already configured in your `.env` file:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GEMINI_API_KEY`

## Usage Examples

### Symptom Checker API
```javascript
POST /api/diseases/symptom-checker
{
  "symptoms": ["fever", "headache", "body pain"],
  "patient_id": 123,
  "language": "en"
}
```

### WhatsApp Message Flow
1. User sends: "मुझे बुखार और सिरदर्द है" (I have fever and headache)
2. System detects disease query and language (Hindi)
3. Routes to Disease Education feature
4. Checks for emergency keywords
5. Analyzes symptoms using AI and database
6. Returns formatted response with disclaimer

## Testing

### Unit Tests
```bash
npm test features/disease-symptoms/tests/
```

### Manual Testing
Use the provided test scripts:
- Test symptom checker with various inputs
- Verify emergency keyword detection
- Check multilingual responses

## Multilingual Support

### Supported Languages
- English (en)
- Hindi (hi) 
- Telugu (te)
- Tamil (ta)
- Bengali (bn)
- Marathi (mr)

### Language Detection
Automatic language detection based on:
- Unicode script ranges
- Common language-specific keywords
- Romanized text patterns

## Security & Privacy

### Data Protection
- No personal health data stored permanently
- Query logging for analytics only
- Patient consent respected
- Secure API endpoints

### Rate Limiting
- Maximum 20 queries per hour per user
- Prevents system abuse
- Graceful degradation

## Monitoring & Analytics

### Metrics Tracked
- Symptom query frequency
- Emergency trigger rates
- User feedback scores
- Language distribution
- Confidence score accuracy

### Logging
- All emergency events logged
- API performance metrics
- Error tracking and alerting

## Integration with Main Server

The feature is integrated into `server.js`:
1. Routes mounted at `/api/diseases`
2. WhatsApp message handler checks for disease queries
3. Automatic routing to Disease Education feature
4. Emergency responses prioritized

## Future Enhancements

### Planned Features
- Voice symptom input processing
- Image-based symptom analysis
- Personalized health recommendations
- Integration with government health APIs
- Advanced ML-based symptom matching

### Scalability
- Caching layer for frequent queries
- Database optimization
- CDN for media content
- Load balancing for high traffic

## Support & Maintenance

### Regular Tasks
- Update disease database with latest medical information
- Review and update emergency keywords
- Monitor system performance and accuracy
- Update multilingual content

### Troubleshooting
- Check database connectivity
- Verify API endpoints
- Review safety event logs
- Monitor rate limiting

---

**Important**: This system is for health awareness and education only. It does not provide medical diagnosis or treatment recommendations. Users are always advised to consult healthcare professionals for medical concerns.
