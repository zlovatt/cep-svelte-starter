declare class ESStatus {
  /** Status type */
  type: "success" | "error";

  /** Status message */
  msg: string;

  /** Return data, if applicable */
  data?: any;

  /** Error, if applicable */
  err?: ZLError;
}

declare class ZLError {
  message: string;
  file: string;
  stack: string;
  error?: string;
}
