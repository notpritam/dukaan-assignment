"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Package2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useHotelStore } from "@/lib/store/store";
import Image from "next/image";

const Header = () => {
  const { user } = useHotelStore();

  return (
    <header className="w-full flex h-14 items-center gap-4 justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Link href="#" className="flex items-center gap-4 text-lg font-semibold">
        <Image src="/logo.png" alt="Acme Inc" width={32} height={32} />
        <span className="">Crestview Hotel</span>
      </Link>

      {/* <form className="">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </form> */}

      {user ? (
        <Link href="/chats">
          <Button className="hidden lg:block" variant={"outline"}>
            Chats
          </Button>
        </Link>
      ) : (
        <Link href="/auth/login">
          <Button className="hidden lg:block" variant={"outline"}>
            Login
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
