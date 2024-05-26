"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { FriendsTable, updateFriend } from "@/lib/actions";
import { Button } from "./Button";

export default function EditForm({ friend }: { friend: FriendsTable }) {
  const initialState = { message: "", errors: {} };
  const updateFriendWithId = updateFriend.bind(null, friend.id, friend.user_id);
  const [state, dispatch] = useFormState(updateFriendWithId, initialState);
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 dark:bg-slate-600 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                step="0.01"
                defaultValue={friend.name}
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                step="0.01"
                defaultValue={friend.email}
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors?.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="contact_no"
            className="mb-2 block text-sm font-medium"
          >
            Contact No.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contact_no"
                name="contact_no"
                type="number"
                step="0.01"
                defaultValue={friend.contact_no}
                placeholder="Enter contact no."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="contact-error"
              />
            </div>
            <div id="contact-error" aria-live="polite" aria-atomic="true">
              {state.errors?.contact_no &&
                state.errors?.contact_no.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="remark" className="mb-2 block text-sm font-medium">
            Remark
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="remark"
                name="remark"
                placeholder="Enter remark"
                defaultValue={friend.remark}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="remark-error"
              />
            </div>
            <div id="remark-error" aria-live="polite" aria-atomic="true">
              {state.errors?.remark &&
                state.errors?.remark.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/friends"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-red-300"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Friend</Button>
      </div>
    </form>
  );
}
