import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, PrimaryHeading } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
};

const PageHeader = ({
  title,
  breadcrumbItems,
  backHref,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "-mx-4 md:-mx-6 lg:-mx-8 -mt-6 mb-6 px-4 md:px-6 lg:px-8 pt-6 pb-2",
        className,
      )}
    >
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {backHref && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
                asChild
              >
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            )}
            <PrimaryHeading className="text-black! tracking-tight text-2xl">
              {title}
            </PrimaryHeading>
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
