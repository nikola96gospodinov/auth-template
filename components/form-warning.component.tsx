import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {
  message?: string;
};

export const FormWarning = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-yellow-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-yellow-500">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
