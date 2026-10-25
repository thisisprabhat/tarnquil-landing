# Privacy Policy for Tarnquil

**Last Updated:** October 11, 2026  
**Effective Date:** October 11, 2026  
**Developer:** Prabhat Kumar ([WayGoSquad.com](https://waygosquad.com))  
**Application:** Tarnquil (`com.waygosquad.tarnquil`)

---

## 1. Overview & Core Commitment

Tarnquil is a minimalist, text-only Android launcher built to help you reduce screen time and cultivate digital mindfulness. We believe that digital wellbeing tools must respect your digital privacy above all else.

**Our Core Privacy Promise:**
- **No Data Collection by the Developer**: We do not collect, harvest, or store any personal information, device identifiers, or user behavior on any server. The only data that leaves your device is a weather request (city or approximate coordinates) sent to Open-Meteo if you enable the Weather widget.
- **No Analytics, No Ads, No Trackers**: Tarnquil contains zero analytics SDKs (no Google Analytics, Firebase, Sentry, Mixpanel, etc.), zero advertising networks, and zero third-party telemetry libraries.
- **On-Device Processing**: All app blocking, session timing, notification filtering, screen time metrics, notes, to-dos, and configuration settings are processed and stored exclusively on your device.
- **No Accounts Required**: Tarnquil does not require you to create an account, log in, or provide an email address or phone number.

---

## 2. Permissions & How They Are Used

Android permissions and special system capabilities requested by Tarnquil are used **strictly and solely on-device** to deliver local launcher and digital wellbeing features:

### A. Accessibility Service (`BIND_ACCESSIBILITY_SERVICE`)
- **Purpose**: Required to detect which application and screen are currently in the foreground so Tarnquil can enforce the boundaries you set:
  - Enforcing opening pauses (countdown delays).
  - Enforcing session duration limits and showing the in-app remaining time progress bar.
  - Enforcing daily usage limits and blocking screens.
  - Blocking short-form video feeds (YouTube Shorts, Instagram Reels, Facebook Reels, Snapchat Spotlight) by detecting active video containers and triggering a system back navigation.
- **Data Handling**: The Accessibility Service only inspects the foreground package name and relevant UI component identifiers needed to detect short-video tabs. **It does NOT monitor, record, store, or transmit your keystrokes, passwords, private messages, personal data, or screen content.**
- **User Control**: You must explicitly grant this service via system settings after reviewing our in-app prominent disclosure dialog. You can disable this service at any time in Android system settings.
- **Disclosure video**: A short video of the in-app disclosure and consent flow is available at [tarnquil.waygosquad.tech/video/accessibility-disclosure.mp4](https://tarnquil.waygosquad.tech/video/accessibility-disclosure.mp4).

### B. Notification Listener Service (`BIND_NOTIFICATION_LISTENER_SERVICE`)
- **Purpose**: Enables the Notification Filter feature to hold notifications from apps that are currently blocked, apps configured for filtered holding, or during active focus/sleep schedules.
- **Data Handling**: When notifications are held, basic details (package name, notification title, message text, and post time) are saved locally in the app's private on-device database (protected by Android's app sandbox) so you can view them later during scheduled digests. **Held notifications never leave your device and are never sent to any external server.**
- **User Control**: Optional. Required only if you enable the Notification Filter feature.

### C. Usage Stats Access (`PACKAGE_USAGE_STATS`)
- **Purpose**: Allows Tarnquil to read system screen-on time and device unlock counts to display your local Screen Time Dashboard, charts, and weekly usage summaries.
- **Data Handling**: Aggregate statistics are read from Android's local `UsageStatsManager` and stored locally on your device. They are never shared, uploaded, or transmitted.
- **User Control**: Optional. You can use the launcher without granting Usage Access if you do not wish to view screen time metrics.

### D. Calendar (`READ_CALENDAR`)
- **Purpose**: Powers the text-only upcoming agenda widget on the home screen.
- **Data Handling**: Read locally on your device to display event titles and times for today and tomorrow. Calendar data is never logged, stored in persistent files, or sent off-device.
- **User Control**: Completely optional. Used only if you enable the Calendar home widget.

### E. Location (`ACCESS_COARSE_LOCATION`)
- **Purpose**: Optional convenience to determine your current city for the home Weather widget.
- **Data Handling**: Used once, when you tap "Use my location", to read your approximate latitude and longitude. Those coordinates are sent to the Open-Meteo weather service to fetch the forecast and are saved on your device as your weather city. Tarnquil has no server and does not collect or store your location anywhere else. Open-Meteo's own policy applies to requests it receives.
- **User Control**: Completely optional. You can manually search and set your city name instead without granting location access.

### F. Internet Access (`INTERNET`)
- **Purpose**: Used solely to fetch current weather conditions and forecasts from the free [Open-Meteo API](https://open-meteo.com) if the Weather widget is enabled.
- **Data Handling**: The request transmits only approximate latitude and longitude coordinates. No user identifiers, device serials, IP addresses, or personal information are sent or linked. Forecast data is cached locally on-device for 30 minutes.

### H. Storage / Document Access (`CREATE_DOCUMENT` / `OPEN_DOCUMENT`)
- **Purpose**: Used via the standard Android Storage Access Framework (SAF) when you manually choose to export or import your settings, notes, and limits as a `.json` backup file.
- **Data Handling**: Tarnquil only accesses the specific file that you explicitly select. We do not access, scan, or read your photos, documents, media, or other storage.

---

## 3. Data Storage, Security & Retention

- **Local Sandbox**: All Tarnquil settings, app limits, focus schedules, notes, and to-do items are stored inside the application's private, sandboxed internal storage (`DataStore` and local SQLite/Room database).
- **Data Retention**: Your data stays on your device for as long as Tarnquil remains installed.
- **Data Deletion**: You can delete all Tarnquil data at any time by:
  1. Clearing application data via **Android Settings → Apps → Tarnquil → Storage → Clear Data**.
  2. Uninstalling Tarnquil from your device (all sandbox databases and settings files are immediately removed by the Android operating system).
- **System Backup Exclusions**: Tarnquil explicitly configures `dataExtractionRules` and `fullBackupContent` to exclude your launcher settings and local databases from automated cloud transfers and device-to-device clones, ensuring that security limits and local onboarding states cannot be inappropriately transferred or exposed.

---

## 4. Third-Party Services & Links

- **Open-Meteo**: Used exclusively for public weather forecast data if the Weather widget is active. Open-Meteo is an open-source weather API that does not require user accounts or API keys. Please review [Open-Meteo's Privacy Policy](https://open-meteo.com/en/terms) for details on their server log handling.
- **No Other Third Parties**: Tarnquil links to no other third-party SDKs, advertising networks, analytics partners, or cloud backends.

---

## 5. Children's Privacy (COPPA & GDPR-K Compliance)

Tarnquil does not collect personal information from anyone, including children under the age of 13 (or under the age of 16 in the European Economic Area). Because no personal information is collected, stored, or transmitted, Tarnquil complies fully with the Children’s Online Privacy Protection Act (COPPA) and General Data Protection Regulation (GDPR).

---

## 6. International Privacy Rights (GDPR & CCPA/CPRA)

Under global privacy regulations (including the EU General Data Protection Regulation and California Consumer Privacy Act):
- **Right to Access / Portability**: You can export all your data and settings at any time via **Settings → Backup & restore → Export settings** to inspect your data in human-readable JSON format.
- **Right to Erasure**: Deleting your app data or uninstalling the app permanently deletes all stored data.
- **No Sale or Sharing of Personal Data**: We do not sell, rent, monetize, or disclose your personal data to any third party.

---

## 7. Changes to This Privacy Policy

If we make updates to this Privacy Policy in future versions of Tarnquil, the revised document will be updated in the application repository with a new "Last Updated" date. Any material changes will be detailed in the app's release notes.

---

## 8. Contact & Inquiries

If you have any questions, feedback, or concerns regarding this Privacy Policy or Tarnquil, please contact us:

- **Developer:** Prabhat Kumar
- **Website:** [https://waygosquad.com](https://waygosquad.com)
- **Landing Page:** [https://tarnquil.waygosquad.com](https://tarnquil.waygosquad.com)
- **Email:** contact@waygosquad.com
