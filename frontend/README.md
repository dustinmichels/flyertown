# FlyerTown

## Setup (For Memory)

```sh
# Create a Vue 3 project with Vite
npm create vite@latest flyertown --template vue-ts
cd flyertown

# Install dependencies
npm install three @capacitor/core @capacitor/android @capacitor/ios

# Add Capacitor
npx cap init FlyerTown com.yourcompany.flyertown

# Add Mobile Platforms
npx cap add android
npx cap add ios

# Sync Vue App to Mobile
npm run build
npx cap sync

# Run on Android
npx cap open android

# Run on iOS
npx cap open ios
```
