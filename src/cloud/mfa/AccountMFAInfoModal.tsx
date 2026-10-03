import Button from "@components/Button";
import { Modal, ModalContent } from "@components/modal/Modal";
import { GradientFadedBackground } from "@components/ui/GradientFadedBackground";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel: () => void;
};

export const AccountMFAInfoModal = ({
  open,
  setOpen,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent showClose={false} maxWidthClass={"max-w-[380px]"}>
        <GradientFadedBackground />
        <div className={"flex items-center justify-center flex-col gap-3 px-6"}>
          <div className={"text-xl font-medium text-center"}>
            <TransText>You may not need NetBird MFA</TransText>
          </div>
          <div className={"text-sm text-nb-gray-300 text-center mb-2"}>
            {`Your`}
            <strong className={"text-nb-gray-200 font-medium"}>
              {" "}
              SSO Provider
            </strong>
            {` may already have MFA enabled. Enabling this setting could result in duplicated MFA checks.`}
          </div>
          <div className={"flex gap-4 w-full"}>
            <Button
              className={"w-full"}
              variant={"secondary"}
              onClick={onCancel}
            >
              <TransText>Cancel</TransText>
            </Button>
            <Button
              className={"w-full"}
              variant={"primary"}
              onClick={onConfirm}
            >
              <TransText>Enable MFA</TransText>
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
