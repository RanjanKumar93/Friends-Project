import { deleteFriends } from "@/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateFriends() {
  return (
    <Link
      href="/friends/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Friend</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateFriends({ id }: { id: string }) {
  return (
    <Link
      href={`/friends/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 hover:text-black"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteFriends({ id, userId }: { id: string; userId: string }) {
  const deleteInvoiceWithId = deleteFriends.bind(null, id, userId);
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-red-600 hover:text-white">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
