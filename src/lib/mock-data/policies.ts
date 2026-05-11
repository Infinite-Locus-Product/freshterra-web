/**
 * Mock policy content. Phase 1 source of truth for /privacy-policy and /terms.
 * When Strapi is wired (see docs/CMS_INTEGRATION.md), this file is no longer
 * imported — only the fetcher in src/features/cms-content/policies.ts changes.
 */
import type { PolicyDocument, PolicySlug } from "@/features/cms-content/types";

const COMPANY_DEFINITIONS = [
  { text: "F&W Foods Pvt. Ltd. (" },
  { text: '"F&W Foods Pvt. Ltd."', bold: true },
  { text: ", " },
  { text: '"Company"', bold: true },
  { text: ", " },
  { text: '"we"', bold: true },
  { text: ", " },
  { text: '"our"', bold: true },
  { text: ", or " },
  { text: '"us"', bold: true },
  { text: ")" },
];

const privacy: PolicyDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  breadcrumbLabel: "Privacy Policy",
  lastUpdated: "2026-05-02",
  contactEmail: "contact@fwfoods.com",
  intro: {
    blocks: [
      {
        type: "paragraph",
        spans: [
          ...COMPANY_DEFINITIONS,
          {
            text: " respects the privacy of its business partners, suppliers, customers, website visitors, and other users (",
          },
          { text: '"Users"', bold: true },
          {
            text: "). This Privacy Policy explains how personal data is collected, used, stored, shared, and protected when Users interact with our website or engage with us for business purposes.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: 'This Policy is framed in accordance with applicable Indian laws, including the Information Technology Act, 2000, related rules and the Digital Personal Data Protection Act, 2023 ("DPDP Act").',
          },
        ],
      },
    ],
  },
  sections: [
    {
      heading: "1. Information We Collect",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "We may collect the following categories of information:" },
          ],
        },
        {
          type: "paragraph",
          spans: [{ text: "a) Personal and Business Information", bold: true }],
        },
        {
          type: "list",
          items: [
            [{ text: "Name" }],
            [{ text: "Email address" }],
            [{ text: "Phone number" }],
            [{ text: "Company name and designation" }],
            [
              {
                text: "Business identification details (including GST, where applicable)",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [{ text: "Such information is collected when:" }],
        },
        {
          type: "list",
          items: [
            [
              {
                text: "Customers contact us through our website, mobile app or offline stores.",
              },
            ],
            [
              {
                text: "Users register or onboard as suppliers, distributors, or business partners",
              },
            ],
            [{ text: "Apply for employment or professional engagement" }],
            [{ text: "Participate in commercial discussions or transactions" }],
          ],
        },
        {
          type: "paragraph",
          spans: [{ text: "b) Technical and Usage Information", bold: true }],
        },
        {
          type: "list",
          items: [
            [{ text: "IP address" }],
            [{ text: "Browser type and device information" }],
            [{ text: "App/Website usage and interaction data" }],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "This information is collected automatically to ensure website functionality, analytics, and security.",
            },
          ],
        },
      ],
    },
    {
      heading: "2. Purpose of Collection and Processing",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Personal data is collected and processed strictly for legitimate business purposes, including:",
            },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Business communication and relationship management" }],
            [
              {
                text: "Supplier onboarding, vendor management, and partnerships",
              },
            ],
            [{ text: "Processing payments and commercial transactions" }],
            [{ text: "Responding to enquiries and service requests" }],
            [{ text: "Recruitment and hiring activities" }],
            [
              {
                text: "Compliance with applicable legal and regulatory requirements",
              },
            ],
            [
              {
                text: "Website or App performance, analytics, and security enhancement",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "We do not process personal data for any purpose incompatible with the above.",
            },
          ],
        },
      ],
    },
    {
      heading: "3. Sharing and Disclosure of Information",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Personal data may be shared on a need-to-know basis with:",
            },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Payment service providers" }],
            [
              {
                text: "IT, hosting, cloud, and communication service providers",
              },
            ],
            [{ text: "Professional advisors (legal, accounting, compliance)" }],
            [
              {
                text: "Government authorities or regulators where required by law",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "All third parties are required to maintain confidentiality and implement reasonable security measures.",
            },
          ],
        },
      ],
    },
    {
      heading: "4. Cookies and Tracking Technologies",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "Our website may use cookies or similar technologies to:" },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Enhance user experience" }],
            [{ text: "Remember user preferences" }],
            [{ text: "Analyse website traffic and usage" }],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "Users may disable cookies through browser settings; however, certain website features may be affected.",
            },
          ],
        },
      ],
    },
    {
      heading: "5. Data Security",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "We implement reasonable technical and organisational safeguards to protect personal data from unauthorised access, misuse, loss, or alteration. While industry-standard measures are followed, Users acknowledge that no electronic transmission or storage system can be guaranteed to be completely secure.",
            },
          ],
        },
      ],
    },
    {
      heading: "6. Data Retention",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Personal data is retained only for as long as necessary to:",
            },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Fulfil the purposes for which it was collected" }],
            [
              {
                text: "Comply with legal, regulatory, or contractual obligations",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "Upon expiry of the retention period, data is securely deleted or anonymised.",
            },
          ],
        },
      ],
    },
    {
      heading: "7. User Rights",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "Subject to applicable law, Users have the right to:" },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Request access to their personal data" }],
            [{ text: "Request correction of inaccurate or incomplete data" }],
            [
              {
                text: "Request deletion of personal data, unless retention is legally required",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "Requests may be made using the contact details provided below and will be addressed within timelines prescribed under law.",
            },
          ],
        },
      ],
    },
    {
      heading: "8. Children's Privacy",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Our website and services are intended solely for business users and professionals. We do not knowingly collect personal data from individuals below 18 years of age.",
            },
          ],
        },
      ],
    },
    {
      heading: "9. Policy Updates",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "This Privacy Policy may be updated periodically. Any changes will be posted on this page, and continued use of the website shall constitute acceptance of the updated Policy.",
            },
          ],
        },
      ],
    },
    {
      heading: "10. Contact and Grievance Redressal",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "For questions, concerns, or requests relating to this Privacy Policy or personal data, please contact us at contact@fwfoods.com",
            },
          ],
        },
      ],
    },
  ],
};

const terms: PolicyDocument = {
  slug: "terms",
  title: "Terms & Conditions",
  breadcrumbLabel: "Terms & Conditions",
  lastUpdated: "2026-05-02",
  contactEmail: "contact@fwfoods.com",
  intro: {
    blocks: [
      {
        type: "paragraph",
        spans: [
          { text: "These Terms & Conditions (" },
          { text: '"Terms"', bold: true },
          {
            text: ") govern access to and use of the website and services of ",
          },
          { text: "F&W Foods Pvt. Ltd.", bold: true },
          { text: " (" },
          { text: '"F&W Foods Pvt. Ltd."', bold: true },
          { text: ", " },
          { text: '"Company"', bold: true },
          { text: ", " },
          { text: '"we"', bold: true },
          { text: ", " },
          { text: '"our"', bold: true },
          { text: ", or " },
          { text: '"us"', bold: true },
          { text: ")." },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "By accessing, browsing, or using our website or engaging with our services, you agree to be bound by these Terms. If you do not agree, you must refrain from using the website or services.",
          },
        ],
      },
    ],
  },
  sections: [
    {
      heading: "1. Nature of App, Website and Use",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "The App (FreshTerra) & Website (https://www.freshterra.in) are intended solely for business, commercial, and professional purposes.",
            },
          ],
        },
        { type: "paragraph", spans: [{ text: "Users agree to:" }] },
        {
          type: "list",
          items: [
            [{ text: "Use the App & website only for lawful purposes" }],
            [
              {
                text: "Not misuse, disrupt, damage, or attempt unauthorised access to the App, Website or systems",
              },
            ],
            [
              {
                text: "Not upload, transmit, or distribute unlawful, misleading, harmful, or infringing content",
              },
            ],
            [{ text: "Comply with all applicable laws and regulations" }],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "We reserve the right to restrict, suspend, or terminate access at our discretion.",
            },
          ],
        },
      ],
    },
    {
      heading: "2. Services",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "F&W Foods Pvt. Ltd. operates food retail stores for fresh, wholesome, and gourmet food products.",
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "The scope, availability, and nature of services may be modified, updated, suspended, or withdrawn at any time without prior notice.",
            },
          ],
        },
      ],
    },
    {
      heading: "3. Payments and Commercial Terms",
      blocks: [
        {
          type: "list",
          items: [
            [
              {
                text: "Prices, product offerings, and commercial terms are subject to change without prior notice.",
              },
            ],
            [
              {
                text: "Payments, where applicable, must be completed in advance unless otherwise agreed in writing.",
              },
            ],
            [
              {
                text: "Payments are processed through third-party payment gateways. The Company does not store sensitive payment information.",
              },
            ],
            [
              {
                text: "Refunds, cancellations, or credits, if any, shall be governed by the relevant commercial agreement, invoice terms, or transaction-specific conditions.",
              },
            ],
          ],
        },
      ],
    },
    {
      heading: "4. Intellectual Property Rights",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "All content available on the mobile app, website, including text, logos, trademarks, brand names, images, graphics, videos, layouts, and other materials, are the exclusive intellectual property of its licensors or F&W Foods Pvt. Ltd.",
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "No content may be copied, reproduced, modified, distributed, published, or used for any commercial purpose without prior written consent from the Company.",
            },
          ],
        },
      ],
    },
    {
      heading: "5. User Responsibilities",
      blocks: [
        { type: "paragraph", spans: [{ text: "Users agree to:" }] },
        {
          type: "list",
          items: [
            [{ text: "Provide accurate, current, and complete information" }],
            [
              {
                text: "Maintain confidentiality of any proprietary, commercial, or non-public information received",
              },
            ],
            [
              {
                text: "Use the mobile app, website and services in a professional, ethical, and lawful manner",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "Any misuse or breach may result in suspension or termination of access.",
            },
          ],
        },
      ],
    },
    {
      heading: "6. Third-Party Links and Tools",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "The website may contain links to third-party websites, platforms, or tools for convenience or operational purposes.",
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "F&W Foods does not control, endorse, or assume responsibility for the content, policies, or practices of such third-party platforms. Access to third-party services is at the User's own risk.",
            },
          ],
        },
      ],
    },
    {
      heading: "7. Disclaimer",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: 'All information and services are provided on an "as is" and "as available" basis.',
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "While reasonable efforts are made to ensure accuracy, F&W Foods makes no warranties or representations regarding the completeness, reliability, suitability, or availability of the app, website or services for any specific business outcome.",
            },
          ],
        },
      ],
    },
    {
      heading: "8. Limitation of Liability",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "To the maximum extent permitted by applicable law:" },
          ],
        },
        {
          type: "list",
          items: [
            [
              {
                text: "F&W Foods shall not be liable for any indirect, incidental, consequential, or user/business losses",
              },
            ],
            [
              {
                text: "The Company shall not be responsible for decisions or actions taken based on the use of the website or services",
              },
            ],
            [
              {
                text: "The total aggregate liability of F&W Foods, if any, shall not exceed the value of services actually paid for by the User",
              },
            ],
          ],
        },
      ],
    },
    {
      heading: "9. Indemnity",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Users agree to indemnify and hold harmless F&W Foods Pvt. Ltd., its directors, officers, employees, and affiliates from and against any claims, losses, damages, liabilities, costs, or expenses arising out of:",
            },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Breach of these Terms" }],
            [{ text: "Misuse of the website or services" }],
            [{ text: "Violation of applicable laws or third-party rights" }],
          ],
        },
      ],
    },
    {
      heading: "10. Termination",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "We reserve the right to suspend or terminate access to the website or services, without prior notice, if:",
            },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "These Terms are violated" }],
            [{ text: "There is misuse, fraud, or unethical conduct" }],
            [{ text: "Required by law or regulatory authority" }],
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "Termination shall not affect rights or obligations accrued prior to termination.",
            },
          ],
        },
      ],
    },
    {
      heading: "11. Governing Law and Jurisdiction",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "These Terms shall be governed by and construed in accordance with the laws of India.",
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "All disputes shall be subject to the exclusive jurisdiction of the courts at Delhi, India.",
            },
          ],
        },
      ],
    },
    {
      heading: "12. Amendments",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "F&W Foods may revise these Terms from time to time to reflect legal, regulatory, or business changes. Updated Terms will be posted on the website, and continued use constitutes acceptance.",
            },
          ],
        },
      ],
    },
    {
      heading: "13. Contact Information",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "For any questions or clarifications regarding these Terms, please contact us at contact@fwfoods.com",
            },
          ],
        },
      ],
    },
  ],
};

export const policiesContent: Partial<Record<PolicySlug, PolicyDocument>> = {
  privacy,
  terms,
};
