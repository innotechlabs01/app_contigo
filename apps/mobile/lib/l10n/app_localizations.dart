import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_es.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('es'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'Contigo'**
  String get appTitle;

  /// No description provided for @appTagline.
  ///
  /// In en, this message translates to:
  /// **'Your health and companionship, always with you'**
  String get appTagline;

  /// No description provided for @landingHeroTitle.
  ///
  /// In en, this message translates to:
  /// **'Contigo'**
  String get landingHeroTitle;

  /// No description provided for @landingHeroSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your health and companionship,\nalways with you'**
  String get landingHeroSubtitle;

  /// No description provided for @landingHeroDescription.
  ///
  /// In en, this message translates to:
  /// **'Find trusted companions for your medical appointments and daily activities'**
  String get landingHeroDescription;

  /// No description provided for @landingServicesTitle.
  ///
  /// In en, this message translates to:
  /// **'Services'**
  String get landingServicesTitle;

  /// No description provided for @landingTestimonialsTitle.
  ///
  /// In en, this message translates to:
  /// **'Testimonials'**
  String get landingTestimonialsTitle;

  /// No description provided for @landingCtaTitle.
  ///
  /// In en, this message translates to:
  /// **'Ready to start?'**
  String get landingCtaTitle;

  /// No description provided for @landingCtaDescription.
  ///
  /// In en, this message translates to:
  /// **'Join Contigo and discover a new way to care and be cared for.'**
  String get landingCtaDescription;

  /// No description provided for @landingCtaButton.
  ///
  /// In en, this message translates to:
  /// **'Start now'**
  String get landingCtaButton;

  /// No description provided for @introWelcomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Contigo'**
  String get introWelcomeTitle;

  /// No description provided for @introWelcomeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your health and companionship, always with you. We connect older adults with trusted companions.'**
  String get introWelcomeSubtitle;

  /// No description provided for @introClientTitle.
  ///
  /// In en, this message translates to:
  /// **'For those seeking companionship'**
  String get introClientTitle;

  /// No description provided for @introClientSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Find verified companions for medical appointments, physical therapy, daily companionship and more.'**
  String get introClientSubtitle;

  /// No description provided for @introCompanionTitle.
  ///
  /// In en, this message translates to:
  /// **'For those who want to help'**
  String get introCompanionTitle;

  /// No description provided for @introCompanionSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Register on our web platform and manage your work from the app.'**
  String get introCompanionSubtitle;

  /// No description provided for @introStartTitle.
  ///
  /// In en, this message translates to:
  /// **'Start today'**
  String get introStartTitle;

  /// No description provided for @introStartSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Join our community and discover a new way to care and be cared for.'**
  String get introStartSubtitle;

  /// No description provided for @introSkip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get introSkip;

  /// No description provided for @introNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get introNext;

  /// No description provided for @introDone.
  ///
  /// In en, this message translates to:
  /// **'Get started'**
  String get introDone;

  /// No description provided for @navHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get navHome;

  /// No description provided for @navRequests.
  ///
  /// In en, this message translates to:
  /// **'Requests'**
  String get navRequests;

  /// No description provided for @navCalendar.
  ///
  /// In en, this message translates to:
  /// **'Calendar'**
  String get navCalendar;

  /// No description provided for @navEarnings.
  ///
  /// In en, this message translates to:
  /// **'Earnings'**
  String get navEarnings;

  /// No description provided for @servicesTitle.
  ///
  /// In en, this message translates to:
  /// **'Services'**
  String get servicesTitle;

  /// No description provided for @serviceMedical.
  ///
  /// In en, this message translates to:
  /// **'Medical Accompaniment'**
  String get serviceMedical;

  /// No description provided for @serviceMedicalDesc.
  ///
  /// In en, this message translates to:
  /// **'Trained companions for medical appointments, hospitalizations, and therapies.'**
  String get serviceMedicalDesc;

  /// No description provided for @serviceDaily.
  ///
  /// In en, this message translates to:
  /// **'Daily Companionship'**
  String get serviceDaily;

  /// No description provided for @serviceDailyDesc.
  ///
  /// In en, this message translates to:
  /// **'Companionship for daily activities, walks, and quality time.'**
  String get serviceDailyDesc;

  /// No description provided for @serviceErrands.
  ///
  /// In en, this message translates to:
  /// **'Errands and Paperwork'**
  String get serviceErrands;

  /// No description provided for @serviceErrandsDesc.
  ///
  /// In en, this message translates to:
  /// **'Support with banking, documents, and administrative tasks.'**
  String get serviceErrandsDesc;

  /// No description provided for @requestFormTitle.
  ///
  /// In en, this message translates to:
  /// **'New Request'**
  String get requestFormTitle;

  /// No description provided for @requestFormStepService.
  ///
  /// In en, this message translates to:
  /// **'Service'**
  String get requestFormStepService;

  /// No description provided for @requestFormStepData.
  ///
  /// In en, this message translates to:
  /// **'Details'**
  String get requestFormStepData;

  /// No description provided for @requestFormStepSchedule.
  ///
  /// In en, this message translates to:
  /// **'Schedule'**
  String get requestFormStepSchedule;

  /// No description provided for @requestFormStepReview.
  ///
  /// In en, this message translates to:
  /// **'Review'**
  String get requestFormStepReview;

  /// No description provided for @requestFormSelectService.
  ///
  /// In en, this message translates to:
  /// **'Select service type'**
  String get requestFormSelectService;

  /// No description provided for @requestFormPersonalData.
  ///
  /// In en, this message translates to:
  /// **'Your personal details'**
  String get requestFormPersonalData;

  /// No description provided for @requestFormFullName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get requestFormFullName;

  /// No description provided for @requestFormIdNumber.
  ///
  /// In en, this message translates to:
  /// **'ID number'**
  String get requestFormIdNumber;

  /// No description provided for @requestFormPhone.
  ///
  /// In en, this message translates to:
  /// **'Phone (optional)'**
  String get requestFormPhone;

  /// No description provided for @requestFormAddress.
  ///
  /// In en, this message translates to:
  /// **'Address (optional)'**
  String get requestFormAddress;

  /// No description provided for @requestFormSchedule.
  ///
  /// In en, this message translates to:
  /// **'Schedule your service'**
  String get requestFormSchedule;

  /// No description provided for @requestFormSelectDate.
  ///
  /// In en, this message translates to:
  /// **'Select preferred date'**
  String get requestFormSelectDate;

  /// No description provided for @requestFormNotes.
  ///
  /// In en, this message translates to:
  /// **'Additional notes (optional)'**
  String get requestFormNotes;

  /// No description provided for @requestFormReview.
  ///
  /// In en, this message translates to:
  /// **'Review your request'**
  String get requestFormReview;

  /// No description provided for @requestFormSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit Request'**
  String get requestFormSubmit;

  /// No description provided for @requestFormEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get requestFormEdit;

  /// No description provided for @requestFormBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get requestFormBack;

  /// No description provided for @requestFormNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get requestFormNext;

  /// No description provided for @requestFormCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get requestFormCancel;

  /// No description provided for @requestFormSuccess.
  ///
  /// In en, this message translates to:
  /// **'Request submitted successfully!'**
  String get requestFormSuccess;

  /// No description provided for @requestFormViewRequests.
  ///
  /// In en, this message translates to:
  /// **'View my requests'**
  String get requestFormViewRequests;

  /// No description provided for @myRequestsTitle.
  ///
  /// In en, this message translates to:
  /// **'My Requests'**
  String get myRequestsTitle;

  /// No description provided for @myRequestsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No requests yet'**
  String get myRequestsEmpty;

  /// No description provided for @myRequestsEmptySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Requests you create will appear here'**
  String get myRequestsEmptySubtitle;

  /// No description provided for @myRequestsFilterAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get myRequestsFilterAll;

  /// No description provided for @myRequestsFilterPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get myRequestsFilterPending;

  /// No description provided for @myRequestsFilterApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get myRequestsFilterApproved;

  /// No description provided for @myRequestsFilterReview.
  ///
  /// In en, this message translates to:
  /// **'In review'**
  String get myRequestsFilterReview;

  /// No description provided for @myRequestsFilterRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get myRequestsFilterRejected;

  /// No description provided for @myRequestsFilterTitle.
  ///
  /// In en, this message translates to:
  /// **'Filter requests'**
  String get myRequestsFilterTitle;

  /// No description provided for @myRequestsClearFilter.
  ///
  /// In en, this message translates to:
  /// **'Clear filter'**
  String get myRequestsClearFilter;

  /// No description provided for @myRequestsNoFilterResults.
  ///
  /// In en, this message translates to:
  /// **'No requests with this filter'**
  String get myRequestsNoFilterResults;

  /// No description provided for @myRequestsTryOther.
  ///
  /// In en, this message translates to:
  /// **'Try another filter'**
  String get myRequestsTryOther;

  /// No description provided for @companionHomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Summary'**
  String get companionHomeTitle;

  /// No description provided for @companionHomeSessions.
  ///
  /// In en, this message translates to:
  /// **'Sessions'**
  String get companionHomeSessions;

  /// No description provided for @companionHomeEarnings.
  ///
  /// In en, this message translates to:
  /// **'Earnings'**
  String get companionHomeEarnings;

  /// No description provided for @companionHomePending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get companionHomePending;

  /// No description provided for @companionHomeAccepted.
  ///
  /// In en, this message translates to:
  /// **'Accepted'**
  String get companionHomeAccepted;

  /// No description provided for @companionHomeUpcoming.
  ///
  /// In en, this message translates to:
  /// **'Upcoming sessions'**
  String get companionHomeUpcoming;

  /// No description provided for @companionHomeNoSessions.
  ///
  /// In en, this message translates to:
  /// **'No upcoming sessions'**
  String get companionHomeNoSessions;

  /// No description provided for @companionHomeNoSessionsDesc.
  ///
  /// In en, this message translates to:
  /// **'Your upcoming sessions will appear here'**
  String get companionHomeNoSessionsDesc;

  /// No description provided for @companionRequestsTitle.
  ///
  /// In en, this message translates to:
  /// **'Requests'**
  String get companionRequestsTitle;

  /// No description provided for @companionRequestsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No requests'**
  String get companionRequestsEmpty;

  /// No description provided for @companionRequestsEmptySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Client service requests will appear here'**
  String get companionRequestsEmptySubtitle;

  /// No description provided for @companionCalendarTitle.
  ///
  /// In en, this message translates to:
  /// **'Calendar'**
  String get companionCalendarTitle;

  /// No description provided for @companionCalendarPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Session calendar'**
  String get companionCalendarPlaceholder;

  /// No description provided for @companionEarningsTitle.
  ///
  /// In en, this message translates to:
  /// **'Earnings'**
  String get companionEarningsTitle;

  /// No description provided for @companionEarningsBalance.
  ///
  /// In en, this message translates to:
  /// **'Total Balance'**
  String get companionEarningsBalance;

  /// No description provided for @companionEarningsPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get companionEarningsPaid;

  /// No description provided for @companionEarningsPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get companionEarningsPending;

  /// No description provided for @companionEarningsHistory.
  ///
  /// In en, this message translates to:
  /// **'Payment history'**
  String get companionEarningsHistory;

  /// No description provided for @companionEarningsEmpty.
  ///
  /// In en, this message translates to:
  /// **'Your earning history will appear here'**
  String get companionEarningsEmpty;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @settingsProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get settingsProfile;

  /// No description provided for @settingsProfileSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Edit your personal information'**
  String get settingsProfileSubtitle;

  /// No description provided for @settingsNotifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get settingsNotifications;

  /// No description provided for @settingsNotificationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Manage your preferences'**
  String get settingsNotificationsSubtitle;

  /// No description provided for @settingsAbout.
  ///
  /// In en, this message translates to:
  /// **'About Contigo'**
  String get settingsAbout;

  /// No description provided for @settingsAboutSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Version 1.0.0'**
  String get settingsAboutSubtitle;

  /// No description provided for @settingsLogout.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get settingsLogout;

  /// No description provided for @settingsLogoutConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to sign out?'**
  String get settingsLogoutConfirm;

  /// No description provided for @settingsLogoutCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get settingsLogoutCancel;

  /// No description provided for @settingsLogoutOk.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get settingsLogoutOk;

  /// No description provided for @profileTitle.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profileTitle;

  /// No description provided for @profileName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get profileName;

  /// No description provided for @profileEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get profileEmail;

  /// No description provided for @profileSave.
  ///
  /// In en, this message translates to:
  /// **'Save changes'**
  String get profileSave;

  /// No description provided for @profileSaved.
  ///
  /// In en, this message translates to:
  /// **'Profile updated'**
  String get profileSaved;

  /// No description provided for @notificationsTitle.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationsTitle;

  /// No description provided for @notificationsPush.
  ///
  /// In en, this message translates to:
  /// **'Push notifications'**
  String get notificationsPush;

  /// No description provided for @notificationsPushDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive notifications on your device'**
  String get notificationsPushDesc;

  /// No description provided for @notificationsEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get notificationsEmail;

  /// No description provided for @notificationsEmailDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive notifications by email'**
  String get notificationsEmailDesc;

  /// No description provided for @notificationsReminders.
  ///
  /// In en, this message translates to:
  /// **'Reminders'**
  String get notificationsReminders;

  /// No description provided for @notificationsSessionReminders.
  ///
  /// In en, this message translates to:
  /// **'Session reminders'**
  String get notificationsSessionReminders;

  /// No description provided for @notificationsSessionRemindersDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive reminders before your sessions'**
  String get notificationsSessionRemindersDesc;

  /// No description provided for @statusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get statusPending;

  /// No description provided for @statusApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get statusApproved;

  /// No description provided for @statusRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get statusRejected;

  /// No description provided for @statusInReview.
  ///
  /// In en, this message translates to:
  /// **'In review'**
  String get statusInReview;

  /// No description provided for @statusUpcoming.
  ///
  /// In en, this message translates to:
  /// **'Upcoming'**
  String get statusUpcoming;

  /// No description provided for @statusCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get statusCompleted;

  /// No description provided for @statusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get statusCancelled;

  /// No description provided for @statusPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get statusPaid;

  /// No description provided for @commonOk.
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get commonOk;

  /// No description provided for @commonCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get commonCancel;

  /// No description provided for @commonConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get commonConfirm;

  /// No description provided for @commonError.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get commonError;

  /// No description provided for @commonRetry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get commonRetry;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'es'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
