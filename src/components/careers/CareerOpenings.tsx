"use client";

import { useState } from "react";

import {
  careersJobCardButtonClass,
  careersJobCardClass,
  careersJobCardDescriptionClass,
  careersJobCardGridClass,
  careersJobCardTitleClass,
  careersOpeningsGroupTitleClass,
  careersOpeningsSectionClass,
  careersOpeningsTitleClass,
} from "@/components/careers/careers-page";
import { Button } from "@/components/ui/Button";

import type { CareersPageDraftContent } from "@/features/cms-content/careers";

import { ApplyNowModal } from "./ApplyNowModal";

type CareerOpeningsProps = Readonly<{
  openings: CareersPageDraftContent["openings"];
}>;

export function CareerOpenings({ openings }: CareerOpeningsProps) {
  const [activeJob, setActiveJob] = useState<string | null>(null);

  return (
    <section className={careersOpeningsSectionClass}>
      <h2 className={careersOpeningsTitleClass}>{openings.title}</h2>

      <div className="space-y-6">
        {openings.groups.map((group) => (
          <section key={group.title}>
            <h3 className={careersOpeningsGroupTitleClass}>{group.title}</h3>
            <div className={careersJobCardGridClass}>
              {group.jobs.map((job) => (
                <article key={job.title} className={careersJobCardClass}>
                  <h4 className={careersJobCardTitleClass}>{job.title}</h4>
                  <p className={careersJobCardDescriptionClass}>
                    {job.description}
                  </p>
                  <Button
                    size="sm"
                    className={careersJobCardButtonClass}
                    onClick={() => setActiveJob(job.title)}
                  >
                    Apply Now
                  </Button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ApplyNowModal
        open={activeJob !== null}
        jobTitle={activeJob ?? ""}
        onClose={() => setActiveJob(null)}
      />
    </section>
  );
}
