"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = ({ params }) => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="px-12 py-4 border-b-2 justify-between border flex w-full">
      <Link href="/" className="flex items-center">
        <span className="text-2xl font-thin uppercase">Grand Horizon Inn</span>
      </Link>
      <Link href="/auth/login" className="flex items-center">
        <Button variant="outline" className="">
          Login
        </Button>
      </Link>
    </div>
  );
};

export default Header;
