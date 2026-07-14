import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Calendar } from "lucide-react";

type Props = {
  date: Date;
};
export default function ExpirationDateRow({ date }: Props) {
  return (
    <div
      className={
        "flex items-center whitespace-nowrap gap-2 dark:text-neutral-300 text-neutral-500 transition-all  py-2 px-3 rounded-md"
      }
    >
      <Calendar size={14} />
      {dayjs(date).locale("zh-cn").format("YYYY年M月D日")}
    </div>
  );
}
