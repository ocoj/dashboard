import Button from "@components/Button";
import { Callout } from "@components/Callout";
import { Checkbox } from "@components/Checkbox";
import HelpText from "@components/HelpText";
import { Label } from "@components/Label";
import { Modal, ModalContent, ModalFooter } from "@components/modal/Modal";
import ModalHeader from "@components/modal/ModalHeader";
import Separator from "@components/Separator";
import { LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useState } from "react";
import {
  CertificateInfo,
  CertificatePromptInfo,
} from "./useRDPCertificateHandler";

type Props = {
  open: boolean;
  certificateInfo: CertificatePromptInfo | null;
  onAccept: (remember: boolean) => void;
  onReject: () => void;
};

export const RDPCertificateModal = ({
  open,
  certificateInfo,
  onAccept,
  onReject,
}: Props) => {
  const tc = useTranslations("common");
  const [rememberCertificate, setRememberCertificate] = useState(false);
  if (!certificateInfo) return null;
  const { hostname, certificate, isChange } = certificateInfo;

  return (
    <Modal open={open} onOpenChange={undefined}>
      <ModalContent maxWidthClass={"max-w-2xl"} showClose={false}>
        <ModalHeader
          icon={<LockIcon className={"text-netbird"} size={18} />}
          title={tc("rdpCertificateTitle")}
          description={hostname}
          color={"netbird"}
        />
        <Separator />

        <div className={"px-8 py-6 flex flex-col gap-6"}>
          {isChange && (
            <Callout variant={"warning"}>
              {tc("rdpCertificateWarning")}
            </Callout>
          )}

          <div>
            <Label>{tc("rdpCertificateDetails")}</Label>
            <HelpText>
              {tc("rdpCertificateHelp")}
            </HelpText>
            <CertificateDetailsList certificate={certificate} />
          </div>

          <label className={"flex items-center space-x-3 cursor-pointer"}>
            <Checkbox
              id="remember-cert"
              checked={rememberCertificate}
              variant={"tableCell"}
              onCheckedChange={(checked) =>
                setRememberCertificate(checked === true)
              }
            />
            <div className={"font-normal text-sm text-nb-gray-200"}>
              {tc("rdpCertificateAlwaysTrust", {
                issuer: certificate?.issuer?.replace("CN=", "") || "",
                hostname: hostname,
              })}
            </div>
          </label>
        </div>

        <ModalFooter className={"items-center"}>
          <div className={"flex gap-3 w-full justify-end"}>
            <Button variant={"secondary"} onClick={onReject}>
              {tc("cancel")}
            </Button>
            <Button
              variant={"primary"}
              onClick={() => onAccept(rememberCertificate)}
            >
              {tc("rdpCertificateAccept")}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const CertificateDetailsList = ({
  certificate,
}: {
  certificate: CertificateInfo;
}) => {
  const tc = useTranslations("common");
  if (!certificate) return null;

  return (
    <div
      className={
        "bg-nb-gray-930 border border-nb-gray-900 rounded-md mt-3 flex flex-col py-3 px-4 gap-2"
      }
    >
      <CertificateDetailsListItem
        label={tc("rdpCertificateIssuer")}
        value={certificate.issuer || tc("rdpCertificateNotAvailable")}
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateSubject")}
        value={certificate.subject || tc("rdpCertificateNotAvailable")}
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateValidFrom")}
        value={
          certificate.validFrom
            ? new Date(certificate.validFrom).toLocaleString()
            : tc("rdpCertificateNotAvailable")
        }
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateValidTo")}
        value={
          certificate.validTo
            ? new Date(certificate.validTo).toLocaleString()
            : tc("rdpCertificateNotAvailable")
        }
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateKeySize")}
        value={certificate.keySize ? `${certificate.keySize} bits` : tc("rdpCertificateNotAvailable")}
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateSerial")}
        value={certificate.serialNumber || tc("rdpCertificateNotAvailable")}
      />
      <CertificateDetailsListItem
        label={tc("rdpCertificateFingerprint")}
        value={certificate.fingerprint || tc("rdpCertificateNotAvailable")}
      />
    </div>
  );
};

const CertificateDetailsListItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div key={label} className={"flex justify-between text-xs gap-10"}>
      <span className={"font-mono text-nb-gray-200 w-[200px]"}>{label}:</span>
      <span className={"font-mono text-nb-gray-300 break-all text-left w-full"}>
        {value}
      </span>
    </div>
  );
};
