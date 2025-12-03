web Application setup:-
-cd wellness-app
-npm install
-npm start
-application will open automatically at http://localhost:3000
 BUILD FOR PRODUCTION
  LIVE LINK:- [https://wellness-app-rose.vercel.app/]
  ## 2. Problem Understanding

### Core Problem
Create an AI-powered wellness recommendation system that provides personalized health tips based on user profile (age, gender, wellness goals) with the following requirements:

### Requirements Analysis
SCREENSHOTS LINK FOR MOBILE:-[https://drive.google.com/file/d/1CA6fw0MylymC3HQ-aOv008f1w3FROwq7/view?usp=drivesdk]
**Screen 1 - Profile Capture:**
- Collect user demographics (age, gender)
- Present selectable wellness goals (Weight Management, Nutrition, Mental Wellness, Fitness, Sleep)
- Validate inputs before proceeding
**Screen 2 - AI-Generated Tips:**
- Generate 5 personalized wellness tips using AI
- Display as scrollable cards with icons and concise titles
- Show preview text for each tip
- Allow users to bookmark/save favorite tips
- Provide regenerate option for fresh recommendations

**Screen 3 - Detailed View:**
- Expand selected tip with AI-generated explanation
- Provide step-by-step actionable advice (5 steps)
- Maintain bookmark functionality in detail view
- Easy navigation back to tips list
**Screen 4 - Persistence:**
- Save favorite tips to local storage
- Display saved tips collection
- Allow removal of saved tips
- Persist data across sessions

### Assumptions Made

1. **AI Integration**: Used Anthropic's Claude API for generating recommendations (accessible without API key in Claude.ai environment)
2. **Single User**: Application is designed for single-user local usage (no backend authentication)
3. **Local Storage**: Sufficient for persistence needs; no database required
4. **Browser Support**: Modern browsers with localStorage and ES6+ support
5. **Responsive Design**: Primarily optimized for desktop/tablet, with mobile-friendly layout
6. **Content Safety**: AI-generated content is appropriate for general wellness guidance (not medical advice)
7. **Offline Functionality**: Saved tips available offline; new generations require internet connection

KNOWN ISSUES AND IMPROVEMENTS:-
1) currently not giving different suggestion according to different requirement, which can be solved by having different dataset and train.
2) we are not taking age as exact age like months and days we can modify it also
