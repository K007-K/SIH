# Healthcare WhatsApp Bot

A multilingual AI-powered healthcare chatbot that provides preventive healthcare information, disease symptom analysis, vaccination schedules, and appointment management via WhatsApp.

## Features

- 🤖 **AI-Powered Health Consultations** - Powered by Google Gemini
- 📱 **WhatsApp Integration** - Direct messaging via WhatsApp Business API
- 👤 **Patient Management** - Complete patient profiles with medical history
- 📅 **Appointment Scheduling** - Book and manage medical appointments
- 💉 **Vaccination Tracking** - Schedule and reminder system
- 🖼️ **Medical Image Analysis** - Analyze medical images using Gemini Vision
- 🔔 **Automated Reminders** - Appointment and vaccination reminders
- 📊 **Health Monitoring** - Track symptoms and medical history
- 🌍 **Multilingual Support** - English (expandable to other languages)

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Messaging**: WhatsApp Business API
- **Hosting**: Render
- **Image Processing**: Gemini Vision API

## Prerequisites

- Node.js (v16 or higher)
- Supabase account
- Google Gemini API key
- WhatsApp Business API access
- Render account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd healthcare-whatsapp-bot
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env
```

Update `.env` with your actual credentials:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# WhatsApp
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Server
PORT=3000
NODE_ENV=production
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create all tables and sample data

### 4. WhatsApp Business API Setup

1. Create a Facebook Business Manager account
2. Create a WhatsApp Business Account
3. Apply for WhatsApp Business API access
4. Get your access token and phone number ID
5. Set up webhook URL: `https://your-domain.com/webhook`

### 5. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your environment variables

### 6. Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add all environment variables
6. Deploy!

## API Endpoints

### Webhook Endpoints
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - Receive WhatsApp messages

### Patient Management
- `GET /api/patients/:phone` - Get patient by phone number
- `POST /api/patients` - Create new patient
- `GET /api/appointments/:patientId` - Get patient appointments

### Health Check
- `GET /` - Server health status

## Database Schema

The bot uses the following main tables:

- **patients** - Patient information and medical history
- **appointments** - Scheduled appointments
- **vaccinations** - Vaccination records
- **chat_sessions** - Chat conversation history
- **messages** - Individual messages
- **health_alerts** - Health alerts and notifications
- **health_tips** - Educational health content

## Features in Detail

### 1. Patient Registration
- Automatic patient creation on first message
- Profile management with medical history
- Emergency contact information

### 2. AI Health Consultations
- Natural language processing for health queries
- Medical image analysis
- Symptom assessment and recommendations
- Emergency detection and alerts

### 3. Appointment Management
- Schedule appointments
- Automated reminders
- Appointment history tracking

### 4. Vaccination System
- Age-based vaccination schedules
- Reminder notifications
- Vaccination history tracking

### 5. Automated Reminders
- Daily appointment reminders
- Weekly vaccination reminders
- Custom health tips

## Usage Examples

### Text Messages
Users can send text messages with health questions:
- "I have a headache, what should I do?"
- "When is my next vaccination due?"
- "Schedule an appointment for next week"

### Image Messages
Users can send medical images for analysis:
- Skin conditions
- Wound photos
- Medical reports
- X-ray images

## Security & Privacy

- All patient data is encrypted
- HIPAA-compliant data handling
- Secure API communications
- Patient data anonymization options

## Monitoring & Analytics

- Message tracking and analytics
- Patient engagement metrics
- Health consultation statistics
- Error monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Multilingual support (Hindi, Tamil, Telugu)
- [ ] Voice message support
- [ ] Integration with government health databases
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] Mobile app companion

---

**Note**: This bot is designed for educational and informational purposes. It should not replace professional medical advice. Always consult with healthcare professionals for serious medical conditions.
