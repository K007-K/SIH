# 🎤 Audio Processing Feature Guide

## Overview
The WhatsApp Healthcare Bot now supports voice message processing with OpenAI Whisper integration for high-quality speech-to-text transcription.

## Features

### ✅ Supported Audio Formats
- **OGG** (WhatsApp default)
- **MP3/MPEG** 
- **MP4/M4A**
- **AMR** (Adaptive Multi-Rate)
- **WAV** (Waveform Audio)

### ✅ Capabilities
- **High-accuracy transcription** using OpenAI Whisper-1 model
- **Multilingual support** (100+ languages with auto-detection)
- **Automatic punctuation** and formatting
- **Noise robustness** for clear transcription
- **Healthcare context processing** after transcription

## Setup Instructions

### 1. Environment Configuration
Add to your `.env` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Production Deployment (Render)
1. Go to Render Dashboard → Your Service → Environment
2. Add environment variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key

### 3. Dependencies
The following packages are required (already installed):
```json
{
  "axios": "^1.7.7",
  "form-data": "^4.0.0"
}
```

## How It Works

### Audio Processing Flow
1. **Reception:** WhatsApp voice message received via webhook
2. **Download:** Audio file downloaded from WhatsApp API
3. **Validation:** MIME type and format validation
4. **Transcription:** OpenAI Whisper converts speech to text
5. **Processing:** Transcribed text processed as healthcare query
6. **Response:** Medical guidance provided based on transcription

### Code Architecture
```javascript
// Audio message handling in server.js
if (message.type === 'audio') {
  const audioId = message.audio?.id;
  const audioMimeType = message.audio?.mime_type;
  
  // Download and transcribe
  const transcription = await transcribeAudio(base64Audio, audioMimeType);
  
  // Process as healthcare query
  const medicalPrompt = createHealthcarePrompt(transcription, patient, language);
  const aiResponse = await getGeminiResponse(medicalPrompt);
}
```

## Testing

### Local Testing
```bash
# Test environment setup
node test-complete-audio.js

# Test OpenAI integration
node test-openai-whisper.js
```

### Production Testing
1. Send voice message via WhatsApp
2. Check bot response includes transcription
3. Verify medical guidance is provided
4. Monitor logs for processing details

## Error Handling

### Comprehensive Error Messages
- **Format errors:** "Sorry, I can only process OGG, MP3, MP4, AMR, and WAV audio formats"
- **API errors:** Specific messages for 400, 401, 403, 404, 429 status codes
- **Timeout errors:** "The audio download timed out. Please try sending a shorter voice message"
- **Transcription failures:** "I could not understand the audio message. Please try speaking more clearly"

### Fallback Behavior
- If OpenAI API key not configured: Graceful message asking for text input
- If transcription fails: Helpful guidance to resend or use text
- If audio download fails: Specific error based on failure type

## Usage Examples

### Supported Voice Queries
- **Symptoms:** "I have a headache and fever"
- **Medications:** "Can I take paracetamol with my blood pressure medicine?"
- **General health:** "What should I eat for better immunity?"
- **Emergency:** "I'm having chest pain"

### Response Format
```
Bot: I received your voice message: "I have a headache"

Based on your symptoms, here are some recommendations:
1. Rest in a quiet, dark room
2. Apply a cold compress to your forehead
3. Stay hydrated...
[Medical guidance continues]
```

## Monitoring

### Key Metrics to Track
- **Transcription accuracy:** Check logs for transcription quality
- **Processing time:** Monitor audio download and transcription duration
- **Error rates:** Track failed transcriptions and API errors
- **User satisfaction:** Monitor if users retry with text after audio fails

### Log Examples
```
Audio downloaded successfully. Size: 45632 bytes
OpenAI transcription successful: "I have been feeling dizzy lately"
Audio processing completed successfully
```

## Security Considerations

### API Key Management
- ✅ OpenAI API key stored in environment variables
- ✅ Not exposed in code or logs
- ✅ GitHub push protection prevents accidental commits

### Data Privacy
- Audio files processed in memory only
- No permanent storage of voice data
- Transcriptions logged for debugging but not stored permanently

## Troubleshooting

### Common Issues

**1. "Audio transcription service not yet configured"**
- Solution: Add OPENAI_API_KEY to environment variables

**2. "OpenAI API access denied"**
- Solution: Verify API key is correct and has sufficient credits

**3. "Invalid audio format"**
- Solution: Ensure audio is in supported format (OGG, MP3, MP4, AMR, WAV)

**4. Audio download timeout**
- Solution: Check WhatsApp API token and network connectivity

### Debug Commands
```bash
# Check environment
echo $OPENAI_API_KEY

# Test API access
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Monitor logs
tail -f /var/log/your-app.log
```

## Performance Optimization

### Best Practices
- Audio files automatically converted to optimal format for OpenAI
- Timeout settings configured for reliable processing
- Error handling prevents system crashes
- Graceful degradation when services unavailable

### Limits
- **File size:** WhatsApp limit ~16MB for audio
- **Duration:** OpenAI Whisper handles up to 25MB files
- **Rate limits:** OpenAI API rate limits apply

## Future Enhancements

### Potential Improvements
- **Language-specific models:** Optimize for Indian languages
- **Real-time transcription:** Stream processing for longer audio
- **Voice response:** Text-to-speech for audio replies
- **Audio analytics:** Track accent patterns and improve accuracy

---

## Quick Start Checklist

- [ ] Add `OPENAI_API_KEY` to local `.env` file
- [ ] Add `OPENAI_API_KEY` to Render environment variables
- [ ] Test with `node test-complete-audio.js`
- [ ] Send test voice message via WhatsApp
- [ ] Verify transcription and medical response
- [ ] Monitor production logs for performance

**🎉 Your healthcare bot now supports voice messages with enterprise-grade speech recognition!**
