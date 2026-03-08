import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, PrimaryHeading } from "@/components/reusables";
import { Button } from "@/components/ui/button";

type ProgressData = {
  percentage: number;
  count: number;
  total: number;
};

type FormHeaderProps = {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
  backHref: string;
  progress?: ProgressData;
};

const FormHeader = ({
  title,
  breadcrumbItems,
  backHref,
  progress,
}: FormHeaderProps) => {
  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-8 -mt-6 mb-8 px-4 md:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="hidden">
          <div className="space-y-1 grow">
            <div className="flex items-center gap-3">
              {/* <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
                asChild
              >
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button> */}
              {/* <PrimaryHeading className="text-black! tracking-tight text-2xl">
                {title}
              </PrimaryHeading> */}
            </div>
          </div>

          {progress && (
            <div className="flex flex-col items-end gap-1.5 min-w-[200px] pl-1 md:pl-0">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Form completion
                </span>
                <span className="text-[11px] font-semibold text-black">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70 font-medium italic">
                {progress.count} of {progress.total} items completed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
