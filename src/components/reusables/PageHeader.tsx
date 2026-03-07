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
  icon?: React.ElementType; // Match icon prop
  className?: string;
  forceSingleRow?: boolean;
};

const PageHeader = ({
  title,
  breadcrumbItems,
  backHref,
  actions,
  icon: Icon,
  className,
  forceSingleRow = false,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "-mx-4 md:-mx-6 lg:-mx-8 -mt-6 mb-6 px-4 md:px-6 lg:px-8 pt-6 pb-2",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="hidden">
          <div className="flex items-center gap-3">
            {/* {backHref && (
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
            )} */}
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="p-1 px-1.5 rounded-md border border-gray-100 bg-gray-50/50">
                  <Icon className="h-5 w-5 text-gray-500" />
                </div>
              )}
              {/* <PrimaryHeading className="text-black! tracking-tight text-2xl">
                {title}
              </PrimaryHeading> */}
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 lg:ml-auto">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
