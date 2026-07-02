/**
 * types/i18n.ts
 * Tipos para internacionalização
 * Data: 26 Dez 2025
 */

export type Language = 'pt' | 'en';

export interface Translations {
  // Common
  common: {
    continue: string;
    cancel: string;
    save: string;
    back: string;
    next: string;
    skip: string;
    confirm: string;
    error: string;
    success: string;
    loading: string;
  };
  
  // Onboarding
  onboarding: {
    slide1Title: string;
    slide1Description: string;
    slide2Title: string;
    slide2Description: string;
    slide3Title: string;
    slide3Description: string;
    getStarted: string;
    alreadyHaveAccount: string;
  };
  
  // Auth
  auth: {
    socialDivider: string;
    welcome: string;
    welcomeBack: string;
    loginSubtitle: string;
    emailOrPhone: string;
    password: string;
    forgotPassword: string;
    login: string;
    register: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    createAccount: string;
    fullName: string;
    email: string;
    phone: string;
    confirmPassword: string;
    acceptTerms: string;
    termsOfUse: string;
    privacyPolicy: string;
    and: string;
    enterEmailForRecovery: string;
    sendRecoveryCode: string;
    sendAgain: string;
    codeSent: string;
    codeExpiry: string;
    backToLogin: string;
  };
  
  // Verification
  verification: {
    verifyEmail: string;
    verifyPhone: string;
    uploadDocument: string;
    uploadSelfie: string;
    verificationStatus: string;
    emailVerified: string;
    phoneVerified: string;
    documentVerified: string;
    completeVerification: string;
    enterCodeSent: string;
    resendCode: string;
    verify: string;
    codeExpiresIn: string;
    didntReceive: string;
    uploadBI: string;
    uploadBIDescription: string;
    takePhoto: string;
    uploadFromGallery: string;
    retakePhoto: string;
    uploadPhoto: string;
    photoGuidelines: string;
    guideline1: string;
    guideline2: string;
    guideline3: string;
    uploadSelfieTitle: string;
    uploadSelfieDescription: string;
    selfieGuidelines: string;
    selfieGuideline1: string;
    selfieGuideline2: string;
    selfieGuideline3: string;
    verificationComplete: string;
    verificationPending: string;
    verificationInProgress: string;
    accountFullyVerified: string;
    accountUnderReview: string;
    completeSteps: string;
    step: string;
    of: string;
    goToApp: string;
    continueVerification: string;
  };
  
  // Settings
  settings: {
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    selectLanguage: string;
    selectTheme: string;
  };

  // Tabs
  tabs: {
    home: string;
    search: string;
    bookings: string;
    profile: string;
  };

  // Profile
  profile: {
    myProfile: string;
    personalInfo: string;
    accountSettings: string;
    verificationStatus: string;
    logout: string;
    editProfile: string;
    changePassword: string;
    notifications: string;
    help: string;
    about: string;
    version: string;
    verified: string;
    notVerified: string;
    completeVerification: string;
  };

  // Home
  home: {
    greeting: string;
    subtitle: string;
    categories: string;
    popularServices: string;
    topWorkers: string;
    viewAll: string;
    emergency: string;
    scheduled: string;
    searchPlaceholder: string;
  };

  // Search
  search: {
    title: string;
    searchPlaceholder: string;
    filters: string;
    category: string;
    rating: string;
    price: string;
    availability: string;
    allCategories: string;
    minRating: string;
    available: string;
    verified: string;
    applyFilters: string;
    clearFilters: string;
    noResults: string;
    tryDifferentSearch: string;
    workersFound: string;
  };

  // Bookings
  bookings: {
    title: string;
    active: string;
    completed: string;
    cancelled: string;
    all: string;
    noPending: string;
    noActive: string;
    noCompleted: string;
    noCancelled: string;
    startBooking: string;
    viewDetails: string;
    status: {
      pending: string;
      accepted: string;
      inProgress: string;
      completed: string;
      cancelled: string;
      rejected: string;
    };
  };

  // Worker
  worker: {
    profile: string;
    about: string;
    services: string;
    portfolio: string;
    reviews: string;
    rating: string;
    completedJobs: string;
    responseTime: string;
    memberSince: string;
    requestService: string;
    chatWithWorker: string;
    contact: string;
    perHour: string;
    fixed: string;
    estimatedDuration: string;
    available: string;
    unavailable: string;
    verified: string;
    noReviews: string;
    noPortfolio: string;
    noServices: string;
    noBio: string;
    noResponseTime: string;
    location: string;
    notFound: string;
    tabs: {
      about: string;
      services: string;
      portfolio: string;
      reviews: string;
    };
  };

  // Request
  request: {
    newRequest: string;
    serviceType: string;
    selectType: string;
    scheduled: string;
    emergency: string;
    scheduledDesc: string;
    emergencyDesc: string;
    selectCategory: string;
    selectWorker: string;
    serviceDetails: string;
    title: string;
    description: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    location: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    additionalInfo: string;
    additionalInfoPlaceholder: string;
    schedule: string;
    preferredDate: string;
    preferredTime: string;
    flexibleTime: string;
    estimatedDuration: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    reviewRequest: string;
    worker: string;
    category: string;
    type: string;
    estimatedPrice: string;
    confirmRequest: string;
    requestSent: string;
    requestSentMessage: string;
  };

  // Booking
  booking: {
    title: string;
    tabs: {
      active: string;
      completed: string;
      cancelled: string;
    };
    status: {
      pending: string;
      accepted: string;
      inProgress: string;
      completed: string;
      cancelled: string;
      rejected: string;
    };
    emergency: string;
    asap: string;
    findWorker: string;
    emptyActive: {
      title: string;
      subtitle: string;
    };
    emptyCompleted: {
      title: string;
      subtitle: string;
    };
    emptyCancelled: {
      title: string;
      subtitle: string;
    };
    details: string;
    timeline: string;
    information: string;
    location: string;
    schedule: string;
    price: string;
    notes: string;
    actions: string;
    cancel: string;
    rate: string;
    contact: string;
    cancelConfirm: string;
    cancelSuccess: string;
    rateService: string;
    yourRating: string;
    writeReview: string;
    submitRating: string;
    ratingSuccess: string;
    date: string;
    time: string;
    duration: string;
    finalPrice: string;
    estimatedPrice: string;
  };
}

