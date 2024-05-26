import { fetchFilteredFriends } from "@/lib/actions";
import { DeleteFriends, UpdateFriends } from "./ButtonLinks";

export default async function FriendsTable({
  query,
  currentPage,
  currentUserId,
}: {
  query: string;
  currentPage: number;
  currentUserId: string;
}) {
  const friends = await fetchFilteredFriends(query, currentPage, currentUserId);

  if (friends.length === 0) {
    return <div className="mt-5">No Friends</div>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="">
            {friends?.map((friend) => (
              <div
                key={friend.id}
                className="mb-2 w-full rounded-md p-4 text-wrap border-[1px]"
              >
                <div className="flex w-full items-center justify-between border-b pb-2">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center">
                      <p className="overflow-hidden">{friend.name}</p>
                    </div>
                    <p className="text-xs sm:text-lg">{friend.email}</p>
                    <p className="text-sm sm:text-xl font-medium">
                      {friend.contact_no}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <UpdateFriends id={friend.id} />
                    <DeleteFriends id={friend.id} userId={friend.user_id} />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{friend.remark}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
