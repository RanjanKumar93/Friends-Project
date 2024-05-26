import { CreateFriends } from "@/components/ButtonLinks";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import FriendsTable from "@/components/Table";
import { fetchFriendsPages } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function FriendsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { userId } = auth();
  if (!userId) {
    return (
      <div className="mt-5 text-3xl font-bold text-center">Unauthorized</div>
    );
  }
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFriendsPages(query, userId);

  return (
    <div className="w-full p-3 flex flex-col justify-center">
      <div className="mt-2 text-3xl font-bold">Contacts</div>
      <div className="flex mt-5 items-center justify-between gap-2">
        <Search placeholder="Search friends..." />
        <CreateFriends/>
      </div>
      <div>
      <Suspense
        key={query + currentPage}
        fallback={<div className="mt-5">Loading...</div>}
      >
        <FriendsTable
          query={query}
          currentPage={currentPage}
          currentUserId={userId}
        />
      </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default FriendsPage;
