"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { BotIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";
import { generateIAReport } from "../_actions/generate-ia-report";
import { logger } from "@/logger";

interface AIReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
}

const IAReportsButton = ({ month, hasPremiumPlan }: AIReportButtonProps) => {
  const [report, setReport] = useState<string | null>();
  const [reportIsLoading, setReportLoading] = useState(false);

  const handleGenerateReportsClick = async () => {
    try {
      setReportLoading(true);
      const iaReport = await generateIAReport({ month });
      setReport(iaReport);
    } catch (error) {
      logger.error(error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-width=[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finânças.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              <Markdown>{report || "Nenhum relatório gerado ainda."}</Markdown>
            </ScrollArea>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button
                onClick={handleGenerateReportsClick}
                disabled={reportIsLoading}
              >
                {reportIsLoading && (
                  <Loader2Icon className="mr-2 animate-spin" />
                )}
                Gerar relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <>
              <DialogHeader>
                <DialogTitle>Relatório IA</DialogTitle>
                <DialogDescription>
                  Você precisa de um plano premium para gerar os relatórios com
                  IA
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancelar</Button>
                </DialogClose>
                <Button asChild>
                  <Link href="/subscription">Assinar Plano Premium</Link>
                </Button>
              </DialogFooter>
            </>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IAReportsButton;
