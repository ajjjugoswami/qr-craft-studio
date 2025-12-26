/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Identity Services
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            theme?: "outline" | "filled_blue" | "filled_black";
            size?: "large" | "medium" | "small";
            type?: "standard" | "icon";
            shape?: "rectangular" | "pill" | "circle" | "square";
            text?: "signin_with" | "signup_with" | "continue_with" | "signin";
            logo_alignment?: "left" | "center";
            width?: number;
          }
        ) => void;
        prompt: () => void;
      };
    };
  };
}