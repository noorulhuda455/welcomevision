# WelcomeVision 👁️

**Patient Experience Platform for Ophthalmology Clinics**

WelcomeVision is a mobile application that enhances the patient experience at ophthalmology clinics through automated geofencing, pre-visit mood tracking, and post-visit feedback collection.

## Features

### 🗺️ Geofence-Based Automation
- Automatically detects when patients arrive at and leave the clinic
- Triggers welcome notifications upon entry
- Sends feedback requests after exit
- Configurable radius monitoring (default: 150m)

### 📝 Pre-Visit Mood Tracking
- Patients can log how they're feeling before their appointment
- Additional comments section for detailed notes
- Helps clinic staff prepare for patient concerns
- Persistent storage across visits

### ⭐ Post-Visit Feedback System
- Automated feedback request when patients leave
- 5-star rating system
- Optional detailed comments
- Tracks feedback history over time

### 📊 Visit History & Analytics
- Complete history of all clinic visits
- View past mood logs and feedback
- Statistics dashboard showing:
  - Total visits
  - Average rating
  - Completed visits count
- Duration tracking for each visit

### 🏥 Staff Management
- Staff can manually close visits from the front desk
- View active patient cases
- Access to pre-visit patient notes

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Geofencing**: Expo Location + TaskManager
- **Notifications**: Expo Notifications
- **Storage**: AsyncStorage
- **Language**: TypeScript

## Project Structure

```
welcomevision/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Home screen (patient check-in)
│   │   ├── history.tsx      # Visit history & stats
│   │   └── explore.tsx      # App info
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Modal screen
├── components/
│   └── feedback-modal.tsx   # Post-visit feedback modal
├── tasks/
│   └── geofence.ts          # Background geofence task
├── utils/
│   └── storage.ts           # Data models & storage service
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing on physical device)
- Or iOS Simulator / Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your device:
   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Physical Device**: Scan QR code with Expo Go app

## Usage

### Patient Flow

1. **Arrival**: When a patient enters the clinic geofence, they receive a welcome notification
2. **Check-in**: Patient logs their pre-visit mood and any concerns
3. **Visit**: Patient receives care from clinic staff
4. **Exit**: Upon leaving, patient receives a notification to provide feedback
5. **Feedback**: Patient rates their experience (1-5 stars) with optional comments
6. **History**: All visits are saved and viewable in the History tab

### Demo Mode

For testing purposes, the app includes simulation controls:

- **Simulate Entry**: Creates a new visit and sends welcome notification
- **Simulate Exit**: Completes current visit and triggers feedback request
- **Staff Close**: Manually close a visit from the front desk

### Permissions Required

- **Location (Foreground & Background)**: To detect clinic entry/exit
- **Notifications**: To send alerts and feedback requests

## Data Models

### Visit
```typescript
interface Visit {
  id: string;
  timestamp: number;
  mood?: string;
  comment?: string;
  enteredAt?: number;
  exitedAt?: number;
  feedback?: Feedback;
  status: "active" | "completed";
}
```

### Feedback
```typescript
interface Feedback {
  rating: number;      // 1-5
  comment: string;
  timestamp: number;
}
```

## Configuration

Update clinic location in `app/(tabs)/index.tsx`:

```typescript
const CLINIC = {
  id: "clinic-nyc-001",
  name: "Your Ophthalmology Clinic",
  latitude: 40.7561,    // Update to your clinic's coordinates
  longitude: -73.9869,
  radius: 150,          // Geofence radius in meters
};
```

## Presentation Tips

### Key Demo Points

1. **Show the complete patient journey**:
   - Use "Simulate Entry" to demonstrate arrival
   - Fill out mood/comment form
   - Use "Simulate Exit" to trigger feedback
   - Show the feedback modal
   - Navigate to History tab to show saved data

2. **Highlight automation**:
   - Emphasize no manual check-in/out needed
   - Background geofencing works when app is closed
   - Automatic feedback collection increases response rates

3. **Show analytics value**:
   - History tab displays actionable metrics
   - Track patient satisfaction trends
   - Identify patterns in pre-visit concerns

4. **Discuss scalability**:
   - Can support multiple clinic locations
   - Easy to add more features (appointment scheduling, test results, etc.)
   - Integration possibilities with EHR systems

## Future Enhancements

- [ ] Multiple clinic location support
- [ ] Appointment scheduling integration
- [ ] Real-time staff dashboard (web portal)
- [ ] Push notification customization
- [ ] Export analytics to CSV
- [ ] Patient medication reminders
- [ ] Insurance information storage
- [ ] Telehealth integration
- [ ] Multi-language support

## License

Private project - All rights reserved

---

Built with React Native & Expo
