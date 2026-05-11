export interface LeadPayload {
  email: string;
  phone?: string;
  consent: boolean;
  source: "coming-soon-notify";
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export type LeadStatus = "idle" | "submitting" | "success" | "error";
