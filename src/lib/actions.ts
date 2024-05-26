"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type FriendsTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  contact_no: string;
  remark: string;
};

export type StateFriend = {
  errors?: {
    name?: string[];
    email?: string[];
    contact_no?: string[];
    remark?: string[];
  };
  message?: string | null;
};

const FormSchemaFriend = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be at most 255 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be at most 100 characters" }),
  contact_no: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .max(20, { message: "Contact number must be at most 20 digits" })
    .regex(/^\+?[0-9]*$/, {
      message: "Contact number must be a valid phone number",
    }),
  remark: z
    .string()
    .max(1000, { message: "Remark must be at most 1000 characters" }),
});

const ITEMS_PER_PAGE = 6; // Define your ITEMS_PER_PAGE constant

export async function fetchFriendsPages(query: string, userId: string) {
  unstable_noStore(); // This function should ensure response is not cached
  try {
    const countResult = await sql`
      SELECT COUNT(*) 
      FROM friends  
      WHERE friends.user_id = ${userId} AND (
        friends.name ILIKE '%' || ${query} || '%' OR
        friends.email ILIKE '%' || ${query} || '%' OR
        friends.remark ILIKE '%' || ${query} || '%' OR
        friends.contact_no::text ILIKE '%' || ${query} || '%'
      );
    `;

    // Ensure countResult is as expected
    if (!countResult || !countResult.rows || !countResult.rows[0]) {
      throw new Error("Unexpected database response");
    }

    const count = Number(countResult.rows[0].count);

    // Check if count is a valid number
    if (isNaN(count)) {
      throw new Error("Invalid count returned from database");
    }

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of friends.");
  }
}

export async function deleteFriends(id: string, userId: string) {
  try {
    const result =
      await sql`DELETE FROM friends WHERE id = ${id} AND user_id = ${userId}`;

    if (result.rowCount === 0) {
      return { message: "No Friend found." };
    }
    revalidatePath("/friends");
    return { message: "Deleted Friend." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Friend." };
  }
}

export async function fetchFilteredFriends(
  query: string,
  currentPage: number,
  userId: string
) {
  unstable_noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const friends = await sql<FriendsTable>`
      SELECT
      friends.id,
      friends.user_id,
      friends.name,
      friends.email,
      friends.contact_no,
      friends.remark
  FROM friends
  WHERE
      friends.user_id = ${userId} AND (
          friends.name ILIKE '%' || ${query} || '%' OR
          friends.email ILIKE '%' || ${query} || '%' OR
          friends.remark ILIKE '%' || ${query} || '%' OR
          friends.contact_no::text ILIKE '%' || ${query} || '%'
      )
  ORDER BY friends.name DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
      `;

    return friends.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch friends.");
  }
}

const CreateFriend = FormSchemaFriend;
export async function createFriend(prevState: StateFriend, formData: FormData) {
  const validatedFields = CreateFriend.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    contact_no: formData.get("contact_no"),
    remark: formData.get("remark"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const { name, email, contact_no, remark } = validatedFields.data;

  const { userId } = auth();

  try {
    await sql`
        INSERT INTO friends (id,user_id,name, email, contact_no, remark)
        VALUES (${String(
          Math.random()
        )},${userId} ,${name}, ${email}, ${contact_no}, ${remark})
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Add friend.",
    };
  }

  revalidatePath("/friends");
  redirect("/friends");
}

export async function fetchFriendById(id: string) {
  unstable_noStore();
  try {
    const data = await sql<FriendsTable>`
      SELECT
        friends.id,
        friends.user_id,
        friends.name,
        friends.email,
        friends.contact_no,
        friends.remark
      FROM friends
      WHERE friends.id = ${id};
    `;

    const friends = data.rows.map((friend) => ({
      ...friend,
    }));

    return friends[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

const UpdateFriend = FormSchemaFriend;
export async function updateFriend(
  id: string,
  userId: string,
  prevState: StateFriend,
  formData: FormData
) {
  const validatedFields = UpdateFriend.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    contact_no: formData.get("contact_no"),
    remark: formData.get("remark"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { name, email, contact_no, remark } = validatedFields.data;

  try {
    await sql`
        UPDATE friends
        SET name = ${name}, email = ${email}, contact_no = ${contact_no}, remark = ${remark}
        WHERE id = ${id} AND user_id = ${userId}
      `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Friend." };
  }

  revalidatePath("/friends");
  redirect("/friends");
}
