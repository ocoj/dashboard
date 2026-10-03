import React, { useEffect, useMemo, useState } from "react";
import Button from "@components/Button";
import { Input } from "@components/Input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
} from "@components/modal/Modal";
import ModalHeader from "@components/modal/ModalHeader";
import { trim } from "lodash";
import { Group } from "@/interfaces/Group";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (name: string) => void;
  groups: Group[] | undefined;
};

export const CreateGroupNameModal = ({
  open,
  onOpenChange,
  onSuccess,
  groups,
}: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isDisabled = useMemo(() => {
    if (error !== "") return true;
    return trim(name).length === 0;
  }, [name, error]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const trimmed = trim(newName);
    // "All" is the system group; name-based checks would misidentify a copy.
    if (trimmed === "All") {
      setError('The name "All" is reserved. Please choose another name.');
    } else {
      const exists = groups?.some((g) => g.name === trimmed);
      setError(
        exists ? "This group already exists. Please choose another name." : "",
      );
    }
    setName(newName);
  };

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent maxWidthClass={"max-w-md"}>
        <ModalHeader
          title={zhMap["Create Group"] || "Create Group"}
          description={zhMap["Set an easily identifiable name for your group."] || "Set an easily identifiable name for your group."}
          color={"blue"}
        />
        <div className={"p-default flex flex-col gap-4"}>
          <Input
            placeholder={"e.g., Developers"}
            value={name}
            onChange={handleNameChange}
            error={error}
            autoFocus
          />
        </div>
        <ModalFooter className={"items-center"} separator={false}>
          <div className={"flex gap-3 w-full justify-end"}>
            <ModalClose asChild={true}>
              <Button variant={"secondary"} className={"w-full"}>
                <TransText>Cancel</TransText>
              </Button>
            </ModalClose>
            <Button
              variant={"primary"}
              className={"w-full"}
              onClick={() => onSuccess(trim(name))}
              disabled={isDisabled}
              type={"submit"}
            >
              <TransText>Save</TransText>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
