import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { auth } from "@clerk/nextjs/server";

const HeaderHome = () => {
  const { userId } = auth();
  return (
    <header className="px-6 py-4 bg-slate-200 dark:bg-slate-700">
      <nav className="flex justify-between items-center">
        <Link href={"/"} className="text-2xl font-bold">
          Friends
        </Link>
        <div className="flex gap-2 items-center justify-center">
          <div className="flex items-center justify-center">
            {userId && <Link className="mr-10" href={"/friends"}>Contacts</Link>}
            <div>
              <ModeToggle />
            </div>
          </div>
          <div className="flex ic  justify-center">
            <SignedOut>
              <Button>
                <SignInButton mode="modal" />
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderHome;
