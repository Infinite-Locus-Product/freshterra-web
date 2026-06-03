"use client";

import { useState } from "react";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import type { CareersPageDraftContent } from "@/features/cms-content/careers";

import { ApplyNowModal } from "./ApplyNowModal";

type CareerOpeningsProps = Readonly<{
  openings: CareersPageDraftContent["openings"];
}>;

export function CareerOpenings({ openings }: CareerOpeningsProps) {
  const [activeJob, setActiveJob] = useState<string | null>(null);

  return (
    <section className="flex w-full max-w-340 flex-col gap-6">
      <Heading
        level={2}
        variant="h2"
        className="font-semibold tracking-normal md:text-[28px] md:leading-none"
      >
        {openings.title}
      </Heading>

      <div className="space-y-6">
        {openings.groups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-4 w-full max-w-340 font-sans text-[28px] leading-tight font-semibold tracking-normal md:text-[20px] md:font-bold md:leading-[130%]">
              {group.title}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 md:gap-12 xl:grid-cols-3">
              {group.jobs.map((job) => (
                <article
                  key={job.title}
                  className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <h4 className="text-[24px] leading-tight font-bold">
                    {job.title}
                  </h4>
                  <Body
                    size="md"
                    className="text-text-secondary mt-2 min-h-[88px] text-[16px] leading-6 tracking-normal"
                  >
                    {job.description}
                  </Body>
                  <Button
                    size="sm"
                    className="mt-6 text-sm tracking-normal normal-case"
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
