import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen h-[40rem] flex items-center justify-center">
      <SignUp  />
    </div>
  );
}
