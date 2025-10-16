# Production Readiness Checklist

Use this checklist before submitting to App Store/Play Store.

## ✅ Code Cleanup (COMPLETED)

- [x] Removed all demo/simulation buttons
- [x] Removed debug/test code
- [x] Updated UI text for production users
- [x] Improved messaging throughout the app
- [x] Brightened color scheme for better UX

## ⚠️ REQUIRED BEFORE SUBMISSION

### 1. Update Clinic Location

**File:** `app/(tabs)/index.tsx` (lines 24-30)

```typescript
const CLINIC = {
  id: "clinic-nyc-001",              // ← Change this
  name: "Your Ophthalmology Clinic", // ← Change this
  latitude: 40.7561,                  // ← Change this
  longitude: -73.9869,                // ← Change this
  radius: 150,                        // ← Adjust if needed (meters)
};
```

**How to find coordinates:**
- Use Google Maps: Right-click → Click coordinates
- Or visit: https://www.latlong.net/

### 2. Update App Branding

**File:** `app.json`

Update these fields:
```json
{
  "expo": {
    "name": "Your Clinic Name Here",
    "slug": "your-clinic-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourclinic.appname"
    },
    "android": {
      "package": "com.yourclinic.appname"
    }
  }
}
```

### 3. Replace App Icons

Replace these files with your clinic's branding:

- `assets/images/icon.png` (1024x1024 PNG)
- `assets/images/splash-icon.png`
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-background.png`
- `assets/images/favicon.png`

**Note:** Android adaptive icon background color is set to `#1e3a8a` (blue) in app.json. Change if needed.

### 4. Update Info Screen (Optional)

**File:** `app/(tabs)/explore.tsx`

- Update clinic contact information (line 87)
- Add clinic address if desired
- Customize the "Need Help?" section

### 5. Test on Real Device

- [ ] Install development build on your phone
- [ ] Go to your actual clinic location
- [ ] Verify automatic check-in works
- [ ] Test all features listed in DEPLOYMENT.md

### 6. Prepare Store Listings

#### App Store (iOS):
- [ ] App name
- [ ] Subtitle (30 chars)
- [ ] Description (4000 chars)
- [ ] Keywords
- [ ] Screenshots (6.7", 6.5", 5.5" iPhones)
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

#### Play Store (Android):
- [ ] App name
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Screenshots (Phone + 10" Tablet)
- [ ] Feature graphic (1024x500)
- [ ] Privacy Policy URL
- [ ] Support email

### 7. Privacy & Legal

- [ ] Create privacy policy (must include location tracking)
- [ ] Review HIPAA compliance if storing patient data
- [ ] Add consent flow if required by your jurisdiction
- [ ] Review app permissions and justify each one

## Quick Start Commands

### Test locally:
```bash
npm start
```

### Build for testing:
```bash
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

### Build for production:
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Submit to stores:
```bash
eas submit --platform ios
eas submit --platform android
```

## Common Issues

**Geofencing not working?**
- Ensure you're using a development or production build (NOT Expo Go)
- Verify location permissions are set to "Always" (iOS) or "Allow all the time" (Android)
- Check that coordinates are correct
- Try increasing the radius to 200-300m for testing

**App rejected by Apple?**
- Provide clear explanation of background location usage in review notes
- Make sure privacy policy mentions location tracking
- Ensure app actually uses the location for the stated purpose

**App rejected by Google?**
- Complete content rating questionnaire
- Explain location permission usage in store listing
- Add privacy policy URL

## Need Help?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions and troubleshooting.

---

**Ready to deploy?** Follow the "Production Launch Steps" in DEPLOYMENT.md.
