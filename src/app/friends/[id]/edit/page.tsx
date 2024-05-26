import EditForm from "@/components/EditForm";
import { fetchFriendById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const friend = await fetchFriendById(id);
  if (!friend) {
    notFound();
  }
  return (
    <main>
      <EditForm friend={friend} />
    </main>
  );
}
