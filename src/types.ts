export interface AwsWafCaptchaConfig {
  onSuccess: (wafToken: string) => void;
  onLoad?: () => void;
  onError?: (err: string) => void;
  onPuzzleTimeout?: () => void;
  onPuzzleIncorrect?: () => void;
  onPuzzleCorrect?: () => void;
  apiKey: string;
}

export interface AwsWafCaptcha {
  renderCaptcha: (
    container: string | HTMLElement,
    config: AwsWafCaptchaConfig
  ) => void;
}

export interface AwsWafIntegration {
  fetch: typeof fetch;
  hasToken: () => boolean;
  getToken: () => Promise<string>;
}

declare global {
  interface Window {
    AwsWafIntegration: AwsWafIntegration;
    AwsWafCaptcha: AwsWafCaptcha;
  }
}

export interface CaptchaOptions {
  apiKey: string;
  captchaContentId: string;
  onCaptchaRequired: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export interface AWSWAFInterceptorConfig {
  API_KEY: string,
  JSAPI_URL: string,

  onSuccess?: () => void,
  onLoad?: () => void,
  onError?: (err: string) => void,
  onPuzzleTimeout?: () => void,
  onPuzzleIncorrect?: () => void,
  onPuzzleCorrect?: () => void,

  captchaContainerId: string,
  captchaContentId?: string,
  overlayId?: string,
  modalId?: string,
}


