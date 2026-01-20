import { AWSWAFInterceptorConfig } from "./types";
import { ensureCaptchaContainer, hideCaptchaModal, showCaptchaModal } from "./utils/modalUtils";
import { checkWAFconfig, loadCaptchaScript } from "./utils/WAFScriptUtils";

export const createCaptchaFetchHandler = (config: AWSWAFInterceptorConfig) => {
  checkWAFconfig(config);
  loadCaptchaScript(config.JSAPI_URL);

  const captchaFetch = (path: RequestInfo | URL, init: RequestInit): Promise<Response> => {
    const captchaForm = ensureCaptchaContainer(config.captchaContainerId, config?.captchaContentId);

    return new Promise((resolve, reject) => {
      if (!window.AwsWafCaptcha) {
        reject(new Error('AWS WAF Captcha is not available'));
        return;
      }

      if (!window.AwsWafIntegration) {
        reject(new Error('AwsWafIntegration is not available'));
        return;
      }

      showCaptchaModal(
        config.captchaContainerId,
        config?.captchaContentId,
        config?.overlayId,
        config?.modalId
      );

      window.AwsWafCaptcha.renderCaptcha(captchaForm, {
        onSuccess: () => {
          hideCaptchaModal(config?.overlayId);
          config?.onSuccess?.();
          resolve(window.AwsWafIntegration.fetch(path, init))
        },
        onLoad: () => {
          config?.onLoad?.();
        },
        onError: (error) => {
          config?.onError?.(error);
          reject(error);
        },
        onPuzzleTimeout: () => {
          config?.onError?.('CAPTCHA timeout');
          reject(new Error('CAPTCHA timeout'));
        },
        onPuzzleIncorrect: () => {
          config?.onPuzzleIncorrect?.();
        },
        onPuzzleCorrect: () => {
          config?.onPuzzleCorrect?.();
        },
        apiKey: config.API_KEY
      })
    })
  }

  return captchaFetch
}