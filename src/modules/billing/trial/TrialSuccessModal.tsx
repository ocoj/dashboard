import Button from "@components/Button";
import { Modal, ModalContent } from "@components/modal/Modal";
import { GradientFadedBackground } from "@components/ui/GradientFadedBackground";
import { Check, CircleCheckBig } from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TrialSuccessModal = ({ open, setOpen }: Props) => {
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent showClose={false} maxWidthClass={"max-w-md"}>
        <GradientFadedBackground />
        <div className={"flex items-center justify-center flex-col gap-3 px-6"}>
          <CircleCheckBig size={28} className={"text-green-500"} />
          <div className={"text-xl font-medium"}>
            <TransText>Your 14-Day Trial has started!</TransText>
          </div>
          <div className={"text-sm text-nb-gray-300 text-center"}>
            {`Welcome aboard! You have now access to NetBird's full set of features & integrations `}
            <b className={"text-nb-gray-200 font-medium"}>
              for the next two weeks
            </b>
            .
          </div>
          <div className={"bg-nb-gray-920 px-5 py-4 rounded-lg mt-4"}>
            <div className={"text-base font-medium mb-1"}>{`What's next?`}</div>
            <div className={"text-sm text-nb-gray-200 mb-2"}>
              <TransText>Explore the dashboard, our integrations and all the features. Some of the key features you can try:</TransText>
            </div>
            <ul className="flex flex-col gap-1.5 mt-4 mb-6">
              <li className="flex items-center gap-2 text-sm text-nb-gray-200">
                <Check size={16} className={"text-netbird"} />
                Configure IdP sync for user & group provisioning
              </li>
              <li className="flex items-center gap-2 text-sm text-nb-gray-200">
                <Check size={16} className={"text-netbird"} />
                <TransText>Set up your first device posture checks</TransText>
              </li>
              <li className="flex items-center gap-2 text-sm text-nb-gray-200">
                <Check size={16} className={"text-netbird"} />
                <TransText>Enable device approvals for added control</TransText>
              </li>
            </ul>
            <Button
              className={"w-full"}
              variant={"primary"}
              onClick={() => setOpen(false)}
            >
              <TransText>Explore NetBird</TransText>
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
