import { AWSWAFInterceptorConfig } from "./types";

export const WAF_SCRIPT_ID = 'AwsWAFScript';

export function checkWAFconfig (config: AWSWAFInterceptorConfig) {
    if (!config.API_KEY) {
      throw new Error('API_KEY is not set');
    }

    if (!config.JSAPI_URL) {
      throw new Error('JSAPI_URL is not set');
    }

    if (!config.captchaContainerId) {
      throw new Error('the captcha container Id is not set');
    }
}

export function loadCaptchaScript (JSAPI_URL: string) {
    if (document.getElementById(WAF_SCRIPT_ID) || !JSAPI_URL) return
    const AwsWafScript = document.createElement('script')
    AwsWafScript.id = WAF_SCRIPT_ID
    AwsWafScript.async = false
    AwsWafScript.src = JSAPI_URL
    document.head.appendChild(AwsWafScript)
}
