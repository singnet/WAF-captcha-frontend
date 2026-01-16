# AWS WAF Captcha Interceptor

## Overview

AWS WAF Captcha Interceptor is a lightweight JavaScript/TypeScript library that provides seamless integration with AWS WAF Captcha for fetch-based HTTP requests. The package handles captcha challenges transparently, intercepting requests and displaying captcha modals when required by AWS WAF.

## Installation

```bash
npm install aws-waf-captcha-interceptor
# or
yarn add aws-waf-captcha-interceptor
```

## Prerequisites

Before using this package, ensure you have AWS WAF configured with CAPTCHA rules

## Quick Start

```typescript
import { createCaptchaInterceptor } from 'aws-waf-captcha-interceptor';

// Initialize the interceptor
const captchaFetch = createCaptchaInterceptor({
  API_KEY: 'your-api-key',
  JSAPI_URL: 'https://your-domain.aws.captcha.jsapi',
  captchaContainerId: 'captcha-container',
});

// Use it like regular fetch
const response = await captchaFetch('/api/protected-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'example' }),
});
```

## Configuration

The package accepts the following configuration object:

```typescript
export interface AWSWAFInterceptorConfig {
  // Required: API credentials
  API_KEY: string;
  JSAPI_URL: string;
  
  // Event handlers
  onSuccess?: () => void;
  onLoad?: () => void;
  onError?: (err: string) => void;
  onPuzzleTimeout?: () => void;
  onPuzzleIncorrect?: () => void;
  onPuzzleCorrect?: () => void;
  
  // Container IDs for DOM injection
  captchaContainerId: string;      // Main container for captcha modal
  captchaContentId?: string;       // Container for captcha form
  overlayId?: string;             // Overlay element ID
  modalId?: string;               // Modal container ID
}
```

### Default Values

If containers IDs not provided, the package will use these default IDs:
- `captchaContentId`: `'captcha-content'`
- `overlayId`: `'captcha-overlay'`
- `modalId`: `'captcha-modal'`

## Usage

### Basic Implementation

```typescript
import { createCaptchaInterceptor } from 'aws-waf-captcha-interceptor';

const config = {
  API_KEY: 'your-api-key',
  JSAPI_URL: 'https://your-domain.aws.captcha.jsapi',
  captchaContainerId: 'aws-captcha-container',
  
  // Optional event handlers
  onSuccess: () => console.log('Captcha solved successfully'),
  onError: (err) => console.error('Captcha error:', err),
  onPuzzleTimeout: () => console.error('Captcha puzzle timed out'),
};

const captchaFetch = createCaptchaInterceptor(config);

// Make authenticated requests
async function fetchProtectedData() {
  try {
    const data = await captchaFetch('/api/data', {
      method: 'GET',
      credentials: 'include',
    });
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### React Example

```tsx
import React, { useEffect } from 'react';
import { createCaptchaInterceptor } from 'aws-waf-captcha-interceptor';

const App = () => {
  useEffect(() => {
    // Initialize once when component mounts
    const captchaFetch = createCaptchaInterceptor({
        API_KEY: 'your-aws-api-key',
        JSAPI_URL: 'https://your-domain.aws.captcha.jsapi',
        captchaContainerId: 'captcha-root',
    });
    
    // Store in context or make globally available
    window.captchaFetch = captchaFetch;
  }, []);
  
  const handleSubmit = async () => {
    try {
      const response = await window.captchaFetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ formData: 'test' }),
      });
      console.log('Success:', response);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <div>
      {/* Container for captcha - must exist in DOM */}
      <div id="captcha-root" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
```

### Advanced Configuration with All Options

```typescript
const advancedConfig = {
  API_KEY: 'your-aws-api-key',
  JSAPI_URL: 'https://your-domain.aws.captcha.jsapi',
  
  // Custom container IDs
  captchaContainerId: 'captcha-root-container',
  captchaContentId: 'custom-captcha-content',
  overlayId: 'custom-overlay',
  modalId: 'custom-modal',
  
  // Event handlers
  onLoad: () => {
    console.log('Captcha library loaded');
  },
  onSuccess: () => {
    console.log('Captcha verification successful');
  },
  onError: (errorMessage) => {
    console.error('Captcha error:', errorMessage);
  },
  onPuzzleTimeout: () => {
    console.warn('User took too long to solve captcha');
  },
  onPuzzleIncorrect: () => {
    console.log('Incorrect captcha solution');
  },
  onPuzzleCorrect: () => {
    console.log('Captcha solved correctly');
  },
};

const captchaFetch = createCaptchaInterceptor(advancedConfig);
```

## API Reference

### `createCaptchaInterceptor(config: AWSWAFInterceptorConfig)`

Creates and returns a fetch wrapper function that automatically handles AWS WAF captcha challenges.

**Parameters:**
- `config`: Configuration object as defined in `AWSWAFInterceptorConfig`

**Returns:**
- A function with the same signature as `fetch()`, but with automatic captcha handling.

### The Wrapped Fetch Function

The returned function has the following signature:

```typescript
(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
```

It behaves exactly like the native `fetch` API, but will automatically:
1. Detect when AWS WAF requires a captcha challenge
2. Display the captcha modal when needed
3. Retry the original request after successful captcha completion
4. Pass through all response data transparently

## How It Works

1. **Initialization**: The interceptor is created with your AWS WAF configuration
2. **Request Interception**: When you make a fetch request, the interceptor checks if AWS WAF returns a captcha challenge
3. **Modal Display**: If a captcha is required, a modal is automatically injected into your specified container
4. **User Interaction**: Users solve the captcha puzzle in the modal
5. **Request Retry**: After successful captcha completion, the original request is retried with the captcha token
6. **Transparent Response**: You receive the API response as if no captcha interruption occurred

For more details check the WAF documentation: https://aws.amazon.com/ru/blogs/networking-and-content-delivery/optimizing-web-application-user-experiences-with-aws-waf-javascript-integrations/. Now realized only the Scenario 5.

## Error Handling

The interceptor will throw errors in these cases:
- AWS WAF configuration is incorrect
- Captcha cannot be displayed (missing container, etc.)
- User fails to solve captcha within allowed attempts
- Network errors during the request

## DOM Requirements

The package requires certain DOM elements to exist or will create them automatically:

```html
<!-- The container you specify in config must exist -->
<div id="your-captcha-container-id">
  <!-- The following elements will be created automatically if not present -->
  <!-- <div id="captcha-overlay"> -->
  <!--   <div id="captcha-modal"> -->
  <!--     <div id="captcha-content"></div> -->
  <!--   </div> -->
  <!-- </div> -->
</div>
```

## TypeScript Support

The package includes full TypeScript definitions. No additional `@types` package is required.

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/aws-waf-captcha-interceptor.git

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Future Roadmap

- [ ] Axios interceptor support
- [ ] Additional WAF captcha scenarios
- [ ] Custom UI theming options

## Security

This package handles sensitive operations. Ensure you:
- Keep your API keys secure
- Use HTTPS for all requests
- Follow AWS WAF security best practices

---

**Note**: This package currently only supports fetch-based requests. Axios support is planned for future releases.
