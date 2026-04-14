import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  description: string;
  link: string;
  children: React.ReactNode;
};

export default function PopupModal({
  title,
  description,
  link,
  children,
}: Props) {
  return (
    <Dialog>
      {/* asChild tells Radix to apply click logic to the div/button you pass in */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="mt-4 text-slate-600 dark:text-slate-300">
            {description}
            <div className="mt-6">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-semibold"
              >
                View Project →
              </a>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
