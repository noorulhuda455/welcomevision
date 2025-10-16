# WelcomeVision - Deployment Guide

This guide will help you get WelcomeVision running on your phone and deploy it for production use.

## Prerequisites

- Node.js installed (v18 or higher recommended)
- Expo CLI installed globally: `npm install -g expo-cli`
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (sign up at https://expo.dev)

## Option 1: Quick Testing with Expo Go (Limited Functionality)

**Note:** Background location features will NOT work with Expo Go. Use this only for quick UI testing.

1. Install the Expo Go app on your phone:
   - iOS: Download from the App Store
   - Android: Download from Google Play Store

2. Start the development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

3. Scan the QR code:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app to scan

**Limitations:** Geofencing and background location tracking will not work in Expo Go.

## Option 2: Development Build (Recommended for Testing)

This creates a standalone app with full functionality including background location.

### Initial Setup

1. Login to EAS:
   ```bash
   eas login
   ```

2. Configure your project:
   ```bash
   eas build:configure
   ```

### Build for iOS

1. Create a development build:
   ```bash
   eas build --profile development --platform ios
   ```

2. Once complete, you'll get a download link or QR code
3. Install the app on your iPhone (via TestFlight or direct install)

### Build for Android

1. Create a development build:
   ```bash
   eas build --profile development --platform android
   ```

2. Download the `.apk` file
3. Enable "Install from Unknown Sources" on your Android device
4. Transfer and install the APK

## Option 3: Production Build (For Distribution)

### iOS Production Build

1. Ensure you have an Apple Developer account ($99/year)

2. Build for production:
   ```bash
   eas build --profile production --platform ios
   ```

3. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

4. Follow Apple's review process

### Android Production Build

1. Build for production:
   ```bash
   eas build --profile production --platform android
   ```

2. Submit to Google Play Store:
   ```bash
   eas submit --platform android
   ```

3. Follow Google's review process

## ⚠️ CRITICAL: Production Readiness Checklist

**Before deploying to the App Store/Play Store, you MUST complete ALL of these steps:**

### Pre-Deployment Checklist

- [ ] **Remove all demo/testing code** (Already done ✓)
- [ ] **Update clinic location coordinates** (See below)
- [ ] **Update app name and branding** (See below)
- [ ] **Replace app icons** (See below)
- [ ] **Test on real device with actual location**
- [ ] **Update privacy policy**
- [ ] **Add App Store/Play Store descriptions**
- [ ] **Configure analytics (optional)**
- [ ] **Set up crash reporting (recommended)**

## Important Configuration Updates

Before deploying to production, update these settings:

### 1. Update Clinic Location

Edit `app/(tabs)/index.tsx` and update the `CLINIC` constant with your actual clinic coordinates:

```typescript
const CLINIC = {
  id: "clinic-nyc-001", // Change to your clinic ID
  name: "Your Ophthalmology Clinic", // Your clinic name
  latitude: 40.7561, // Your clinic latitude
  longitude: -73.9869, // Your clinic longitude
  radius: 150, // Detection radius in meters (adjust as needed)
};
```

To find your coordinates:
- Use Google Maps: Right-click on your location → Click the coordinates to copy
- Or use: https://www.latlong.net/

### 2. Update App Branding

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your Clinic Name",
    "slug": "your-clinic-app",
    "ios": {
      "bundleIdentifier": "com.yourclinic.welcomevision"
    },
    "android": {
      "package": "com.yourclinic.welcomevision"
    }
  }
}
```

### 3. Update App Icons and Splash Screen

Replace these files with your branding:
- `assets/images/icon.png` (1024x1024)
- `assets/images/splash-icon.png` (for splash screen)
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-background.png`

## Testing Checklist

Before production deployment, test these features **on a real device at your actual clinic location**:

- [ ] Location permissions granted (foreground and background)
- [ ] Notification permissions granted
- [ ] App detects clinic entry **automatically when you arrive**
- [ ] Welcome notification appears on entry
- [ ] Pre-visit notes save correctly
- [ ] Manual "End My Visit" button works
- [ ] Feedback request notification appears after ending visit
- [ ] Feedback submission works
- [ ] Visit history displays correctly
- [ ] App works in background (phone locked)
- [ ] App detects clinic exit automatically
- [ ] All branding/names are correct throughout the app

## Troubleshooting

### Background Location Not Working

1. Ensure permissions are granted in phone settings
2. Check that you're using a development or production build (NOT Expo Go)
3. On iOS: Enable "Location: Always" in Settings → App → Location
4. On Android: Enable "Allow all the time" for location

### Build Fails

1. Clear cache: `npx expo start -c`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Check EAS build logs for specific errors

### Geofencing Not Triggering

1. Verify clinic coordinates are correct
2. Adjust the radius if needed (try 200-300 meters for testing)
3. Ensure you've actually crossed the geofence boundary
4. On iOS, location services must be set to "Always"

## Privacy and Compliance

Before releasing to users:

1. Update privacy policy to include location tracking
2. Ensure HIPAA compliance if storing patient data
3. Add clear explanations in the app about data usage
4. Consider adding opt-in consent flow on first launch

## Production Launch Steps

Once all checklist items are complete:

### For iOS:

1. **Build for production:**
   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

3. **Complete App Store listing:**
   - Add screenshots (required: iPhone 6.7", iPhone 6.5", iPhone 5.5")
   - Write app description
   - Add privacy policy URL
   - Set app category (Medical/Healthcare)
   - Add support contact information
   - Explain background location usage in review notes

4. **Wait for Apple review** (typically 1-3 days)

### For Android:

1. **Build for production:**
   ```bash
   eas build --profile production --platform android
   ```

2. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

3. **Complete Play Store listing:**
   - Add screenshots (required: Phone and 10" Tablet)
   - Write app description
   - Add privacy policy URL
   - Set app category (Medical)
   - Complete content rating questionnaire
   - Explain location permissions in store listing

4. **Wait for Google review** (typically a few hours to 1 day)

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev
- Review EAS Build docs: https://docs.expo.dev/build/introduction/
- Check app logs for errors: `npx expo start` and press `j` to open debugger

## Next Steps

After deployment:

1. Monitor user feedback through the History tab analytics
2. Adjust geofence radius based on real-world performance
3. Add backend integration for staff dashboard (if needed)
4. Consider adding push notification campaigns
5. Expand to multiple clinic locations

---

**Version:** 1.0.0
**Last Updated:** October 2025
