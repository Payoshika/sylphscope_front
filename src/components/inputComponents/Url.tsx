import React, { useState, useEffect } from "react";

interface UrlProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "regular" | "large";
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  autoComplete?: string;
  // Validation props
  validate?: boolean;
  allowProtocols?: string[]; // e.g., ['http', 'https', 'ftp']
  requireProtocol?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Url: React.FC<UrlProps> = ({
  id,
  name,
  label,
  placeholder = "Enter URL (e.g., https://example.com)",
  value,
  onChange,
  size = "regular",
  disabled = false,
  error = false,
  required = false,
  autoComplete = "url",
  validate = true,
  allowProtocols = ["http", "https"],
  requireProtocol = true,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // URL validation function
  const validateUrl = (url: string) => {
    if (!validate) return { isValid: true, errorMessage: "" };

    // Required validation
    if (required && !url.trim()) {
      return { isValid: false, errorMessage: "URL is required" };
    }

    // If not required and empty, it's valid
    if (!required && !url.trim()) {
      return { isValid: true, errorMessage: "" };
    }

    const trimmedUrl = url.trim();

    // Basic length validation
    if (trimmedUrl.length > 2048) {
      return {
        isValid: false,
        errorMessage: "URL is too long (max 2048 characters)",
      };
    }

    // Check for obvious invalid characters
    if (trimmedUrl.includes(" ")) {
      return { isValid: false, errorMessage: "URL cannot contain spaces" };
    }

    try {
      let urlToValidate = trimmedUrl;

      // If protocol is required but missing, try to add https://
      if (requireProtocol && !trimmedUrl.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
        if (trimmedUrl.startsWith("www.") || trimmedUrl.includes(".")) {
          urlToValidate = `https://${trimmedUrl}`;
        } else {
          return {
            isValid: false,
            errorMessage: "Please include a protocol (e.g., https://)",
          };
        }
      }

      // Create URL object for validation
      const urlObj = new URL(urlToValidate);

      // Check allowed protocols
      if (allowProtocols.length > 0) {
        const protocol = urlObj.protocol.slice(0, -1); // Remove trailing ':'
        if (!allowProtocols.includes(protocol)) {
          return {
            isValid: false,
            errorMessage: `Protocol must be one of: ${allowProtocols.join(
              ", "
            )}`,
          };
        }
      }

      // Validate hostname
      if (!urlObj.hostname) {
        return { isValid: false, errorMessage: "Please enter a valid domain" };
      }

      // Check for valid domain structure
      const domainRegex =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(urlObj.hostname)) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid domain name",
        };
      }

      // Check for localhost or IP addresses (optional validation)
      if (
        urlObj.hostname === "localhost" ||
        /^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)
      ) {
        // Allow localhost and IP addresses - you might want to restrict these in production
      }

      // Check for suspicious TLDs (basic check)
      const tld = urlObj.hostname.split(".").pop()?.toLowerCase();
      if (tld && tld.length < 2) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid domain extension",
        };
      }

      return { isValid: true, errorMessage: "" };
    } catch (urlError) {
      // URL constructor failed
      if (!requireProtocol && !trimmedUrl.includes("://")) {
        // Try again with protocol
        try {
          const urlWithProtocol = `https://${trimmedUrl}`;
          new URL(urlWithProtocol);
          return { isValid: true, errorMessage: "" };
        } catch {
          return { isValid: false, errorMessage: "Please enter a valid URL" };
        }
      }
      return { isValid: false, errorMessage: "Please enter a valid URL" };
    }
  };

  // Validate on value change
  useEffect(() => {
    if (value.length === 0) {
      setInternalError("");
      if (required) {
        onValidationChange?.(false, "URL is required");
      } else {
        onValidationChange?.(true, "");
      }
      return;
    }

    if (validate && value !== undefined) {
      const { isValid, errorMessage } = validateUrl(value);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [
    value,
    validate,
    required,
    allowProtocols,
    requireProtocol,
    onValidationChange,
  ]);

  // Auto-format URL on blur (add protocol if missing and valid)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();

    if (trimmedValue && !trimmedValue.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
      // If it looks like a URL but missing protocol, add https://
      if (trimmedValue.includes(".") && !trimmedValue.includes(" ")) {
        const urlWithProtocol = `https://${trimmedValue}`;
        try {
          new URL(urlWithProtocol);
          // Only update if the URL is valid
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: urlWithProtocol,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        } catch {
          // Don't auto-add protocol if it results in invalid URL
        }
      }
    }
  };

  const getInputClass = () => {
    let baseClass = "input";
    if (size === "small") baseClass += " input--small";
    if (size === "large") baseClass += " input--large";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <input
        type="url"
        id={id}
        name={name}
        className={getInputClass()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
      />
      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Url;

// Helper functions for external use
export const isValidUrl = (
  url: string,
  protocols: string[] = ["http", "https"]
): boolean => {
  try {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.slice(0, -1);
    return protocols.includes(protocol);
  } catch {
    return false;
  }
};

export const formatUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (!trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `https://${trimmed}`;
    }
  }
  return trimmed;
};

export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.includes("://") ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return "";
  }
};
